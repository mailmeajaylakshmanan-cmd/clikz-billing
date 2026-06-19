const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

// Base route for Dashboard Client Compatibility (GET /api/dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find();
    
    // Calculate KPIs in memory
    const totalReceived = invoices.reduce((acc, inv) => acc + (inv.totalPaid || 0), 0);
    const totalBalance = invoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);
    const totalInvoices = invoices.length;

    res.json({
      totalReceived,
      totalBalance,
      totalInvoices,
      totalRevenue: invoices.reduce((acc, inv) => acc + (inv.total || 0), 0),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Specific stats route requested (GET /api/dashboard/stats)
router.get('/stats', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find();
    
    // In-memory calculations for metrics
    const netProfit = invoices.reduce((acc, inv) => {
      const totalAmount = inv.billing?.totalAmount || inv.total || 0;
      const expenses = 0; // Default fallback as Schema has no expense tracking
      return acc + (totalAmount - expenses);
    }, 0);
    const pendingDues = invoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);
    const activeProjects = invoices.filter(inv => {
      const status = inv.eventDetails?.status || inv.status;
      return status !== 'Completed' && status !== 'paid';
    }).length;

    res.json({ netProfit, pendingDues, activeProjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
