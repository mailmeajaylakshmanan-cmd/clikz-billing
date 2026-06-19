const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.post('/assign-crew', auth, async (req, res) => {
  const { invoiceId, employeeId, role, dayRate } = req.body;

  try {
    // 1. Fetch the invoice/event
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice / Event not found" });
    }
    
    const eventDate = invoice.eventDetails?.date || invoice.date;

    // 2. Double-Booking Check
    const conflict = await Invoice.findOne({
      "eventDetails.date": eventDate,
      "staffAllocated.employeeId": employeeId
    });

    if (conflict) {
      return res.status(400).json({ message: "Crew member is already booked for this date!" });
    }

    // 3. Get Employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 4. Assign Crew
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { 
        $push: { 
          staffAllocated: { 
            employeeId, 
            name: employee.name, 
            role: role || employee.role, 
            dayRate: dayRate || employee.baseDayRate || employee.dayRate 
          } 
        },
        $set: { staffingStatus: 'Partially Staffed' }
      },
      { new: true }
    );

    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
