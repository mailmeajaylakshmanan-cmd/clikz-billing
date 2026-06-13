const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// Helper to recalculate and sync client stats
async function syncClientStats(phone, name) {
  if (!phone) return;
  
  // Find all invoices matching client.phone
  const invoices = await Invoice.find({ 'client.phone': phone });
  
  const totalInvoices = invoices.length;
  let totalPaid = 0;
  let totalBilled = 0;
  
  invoices.forEach(inv => {
    totalBilled += (inv.total || 0);
    totalPaid += ((inv.advancePaid || 0) + (inv.totalPaid || 0));
  });
  
  const totalBalance = Math.max(0, totalBilled - totalPaid);
  
  // Find or create the client, updating stats
  await Client.findOneAndUpdate(
    { phone },
    {
      name: name || (invoices[0] ? invoices[0].client.name : ''),
      totalInvoices,
      totalPaid,
      totalBalance
    },
    { upsert: true, new: true }
  );
}

// GET all invoices
router.get('/', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { 'client.name': { $regex: search, $options: 'i' } },
        { invoiceNo: { $regex: search, $options: 'i' } },
        { 'client.phone': { $regex: search, $options: 'i' } },
      ];
    }
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Invoice.countDocuments(query);
    res.json({ invoices, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create invoice
router.post('/', auth, async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    
    // Sync client stats
    await syncClientStats(invoice.client.phone, invoice.client.name);
    
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const oldInvoice = await Invoice.findById(req.params.id);
    if (!oldInvoice) return res.status(404).json({ message: 'Invoice not found' });
    
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // Sync new client stats
    await syncClientStats(invoice.client.phone, invoice.client.name);
    
    // If client phone changed, also sync old client stats
    if (oldInvoice.client?.phone !== invoice.client?.phone) {
      await syncClientStats(oldInvoice.client?.phone);
    }
    
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update status only
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    // Sync client stats
    await syncClientStats(invoice.client.phone, invoice.client.name);
    
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    await Invoice.findByIdAndDelete(req.params.id);
    
    // Sync client stats after deletion
    await syncClientStats(invoice.client.phone);
    
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
