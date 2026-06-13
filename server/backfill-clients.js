const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in environment. Make sure server/.env is configured.');
  process.exit(1);
}

// Define inline schemas to avoid dependency mismatch
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  totalInvoices: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  totalBalance: { type: Number, default: 0 },
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  client: {
    name: String,
    phone: String,
  },
  total: Number,
  advancePaid: Number,
  totalPaid: Number,
  balance: Number,
});

const Client = mongoose.model('Client', clientSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);

async function backfill() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Get all invoices
  const invoices = await Invoice.find({});
  console.log(`Found ${invoices.length} total invoices in database.`);

  // Group by client phone
  const clientsData = {};
  for (const inv of invoices) {
    const phone = inv.client?.phone;
    const name = inv.client?.name;
    if (!phone) continue;

    if (!clientsData[phone]) {
      clientsData[phone] = {
        name: name,
        phone: phone,
        totalInvoices: 0,
        totalPaid: 0,
        totalBilled: 0,
      };
    }

    clientsData[phone].totalInvoices += 1;
    clientsData[phone].totalBilled += (inv.total || 0);
    clientsData[phone].totalPaid += ((inv.advancePaid || 0) + (inv.totalPaid || 0));
  }

  // Upsert all clients
  const phones = Object.keys(clientsData);
  console.log(`Syncing stats for ${phones.length} unique client phone numbers...`);

  for (const phone of phones) {
    const data = clientsData[phone];
    const totalBalance = Math.max(0, data.totalBilled - data.totalPaid);

    const clientDoc = await Client.findOneAndUpdate(
      { phone },
      {
        $setOnInsert: { email: '', address: '' },
        name: data.name,
        totalInvoices: data.totalInvoices,
        totalPaid: data.totalPaid,
        totalBalance: totalBalance,
      },
      { upsert: true, new: true }
    );
    console.log(`- Synced client: "${clientDoc.name}" (${clientDoc.phone}) | Invoices: ${data.totalInvoices} | Paid: INR ${data.totalPaid} | Balance: INR ${totalBalance}`);
  }

  console.log('Backfill process complete!');
  process.exit(0);
}

backfill().catch(err => {
  console.error('Backfill error:', err);
  process.exit(1);
});
