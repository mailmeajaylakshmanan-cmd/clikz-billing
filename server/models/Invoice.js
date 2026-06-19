const mongoose = require('mongoose');

const serviceLineSchema = new mongoose.Schema({
  service: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true },
  
  // Legacy / compatible fields
  date: { type: Date, default: Date.now },
  event: { type: String, default: '' },
  eventDate: { type: String, default: '' },
  location: { type: String, default: '' },
  subTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  advancePaid: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'sent', 'partial', 'paid'],
    default: 'draft',
  },
  notes: { type: String, default: 'Grateful to be part of your celebration.' },
  services: [serviceLineSchema],
  
  // New refined fields
  client: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  eventDetails: {
    type: { type: String }, // e.g. Wedding
    date: Date,
    location: String,
    status: { type: String, enum: ['Enquiry', 'Confirmed', 'In Progress', 'Completed'], default: 'Enquiry' }
  },
  staffAssignments: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    roleAssigned: String,
    payStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
  }],
  billing: {
    subTotal: Number,
    discount: { type: Number, default: 0 },
    totalAmount: Number,
    advancePaid: { type: Number, default: 0 },
    paymentHistory: [{
      date: { type: Date, default: Date.now },
      amount: Number,
      method: String // UPI, Cash, Bank
    }]
  },
  balanceDue: Number
}, { timestamps: true });

// Auto-calculate and generate invoiceNo and balanceDue before saving
invoiceSchema.pre('save', async function(next) {
  // 1. Generate invoiceNo: CWF-YYYY-XXXX
  if (!this.invoiceNo) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments({ 
      invoiceNo: { $regex: `CWF-${year}` } 
    });
    const sequence = (count + 1).toString().padStart(4, '0');
    this.invoiceNo = `CWF-${year}-${sequence}`;
  }

  // 2. Set subTotal/discount/totalAmount/paymentHistory defaults if not provided to bridge formats
  if (!this.billing) {
    this.billing = {};
  }
  
  if (this.billing.subTotal === undefined) this.billing.subTotal = this.subTotal || 0;
  if (this.billing.discount === undefined) this.billing.discount = this.discount || 0;
  if (this.billing.advancePaid === undefined) this.billing.advancePaid = this.advancePaid || 0;
  this.billing.totalAmount = (this.billing.subTotal || 0) - (this.billing.discount || 0);

  // Ensure payment history has at least the advance payment if it exists
  if ((!this.billing.paymentHistory || this.billing.paymentHistory.length === 0) && this.billing.advancePaid > 0) {
    this.billing.paymentHistory = [{
      amount: this.billing.advancePaid,
      method: 'Cash',
      date: this.date || new Date()
    }];
  }

  const totalPayments = this.billing.paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;
  this.balanceDue = this.billing.totalAmount - totalPayments;

  // Sync back to old fields so old dashboard analytics and listings don't break
  this.total = this.billing.totalAmount;
  this.advancePaid = this.billing.advancePaid;
  this.totalPaid = totalPayments;
  this.balance = this.balanceDue;
  
  if (this.eventDetails) {
    if (this.eventDetails.location) this.location = this.eventDetails.location;
    if (this.eventDetails.date) this.eventDate = this.eventDetails.date.toISOString().split('T')[0];
    if (this.eventDetails.type) this.event = this.eventDetails.type;
    
    // Map event status to legacy status
    if (this.eventDetails.status) {
      const statusMap = {
        'Enquiry': 'draft',
        'Confirmed': 'sent',
        'In Progress': 'partial',
        'Completed': 'paid'
      };
      this.status = statusMap[this.eventDetails.status] || this.status;
    }
  } else {
    // Sync from legacy fields to new eventDetails fields
    const reverseStatusMap = {
      'draft': 'Enquiry',
      'sent': 'Confirmed',
      'partial': 'In Progress',
      'paid': 'Completed'
    };
    this.eventDetails = {
      type: this.event,
      date: this.eventDate ? new Date(this.eventDate) : this.date,
      location: this.location,
      status: reverseStatusMap[this.status] || 'Enquiry'
    };
  }

  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
