const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Service = require('../models/Service');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch login credentials from MongoDB
    const user = await Login.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password using bcrypt (or plain-text fallback)
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, email });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check if user already exists
    const existingUser = await Login.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin account already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new Login({
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/seed-demo
router.post('/seed-demo', async (req, res) => {
  try {
    // 1. Clear existing collections
    await Invoice.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});

    // 2. Insert standard professional services
    const servicesData = [
      {
        name: 'Wedding Teaser',
        descriptions: [
          '1-2 Minute Cinematic Teaser',
          'Social Media Optimized (Vertical/Horizontal)',
          'Delivered within 7 days of event'
        ]
      },
      {
        name: 'Cinematic Highlight Film',
        descriptions: [
          '5-8 Minute Cinematic Highlight Reel',
          '4K Resolution UHD output',
          'Pro Color Grading & Custom Sound Design'
        ]
      },
      {
        name: 'Traditional Wedding Documentary',
        descriptions: [
          '60-90 Minute Full Ceremony Coverage',
          'Multicam Video Setup',
          'HQ Multi-channel Audio Recording'
        ]
      },
      {
        name: 'Candid Photography',
        descriptions: [
          '1 Principal Candid Photographer',
          'High-end mirrorless gear used',
          'All raw images delivered plus 80 edited photos'
        ]
      },
      {
        name: 'Traditional Photography',
        descriptions: [
          '1 Traditional Event Photographer',
          'Complete coverage of rituals & guests',
          'Custom luxury layout 40-page photo album'
        ]
      },
      {
        name: 'Pre-Wedding Shoot',
        descriptions: [
          '1-day Outdoor/Studio Location Shoot',
          '2-minute pre-wedding concept video film',
          '35 masterfully-edited high-res images'
        ]
      }
    ];
    await Service.insertMany(servicesData);

    // 3. Create professional clients
    const clientsData = [
      {
        name: 'Priya & Karthik',
        phone: '9876543210',
        email: 'priya.karthik@gmail.com',
        address: 'No 45, Sterling Road, Nungambakkam, Chennai - 600034',
        totalInvoices: 1,
        totalPaid: 50000,
        totalBalance: 100000
      },
      {
        name: 'Sneha & Rahul',
        phone: '8765432109',
        email: 'sneha.rahul@yahoo.com',
        address: 'Flat 302, Royal Residency, Jayanagar 4th Block, Bangalore - 560011',
        totalInvoices: 1,
        totalPaid: 85000,
        totalBalance: 0
      },
      {
        name: 'Ananya & Vikram',
        phone: '7654321098',
        email: 'ananya.vikram@gmail.com',
        address: 'Bungalow 7, Sea Breeze Enclave, Bandra West, Mumbai - 400050',
        totalInvoices: 1,
        totalPaid: 15000,
        totalBalance: 50000
      }
    ];
    await Client.insertMany(clientsData);

    // 4. Create professional invoices
    const invoicesData = [
      {
        invoiceNo: 'CWF-0001',
        date: new Date('2026-06-10'),
        client: {
          name: 'Priya & Karthik',
          phone: '9876543210'
        },
        event: 'Wedding & Reception',
        eventDate: '2026-08-15',
        location: 'Taj Connemara Ballroom, Chennai',
        services: [
          {
            service: 'Cinematic Highlight Film',
            description: '4K Full cinematic film coverage (2 Days)',
            price: 85000,
            total: 85000
          },
          {
            service: 'Candid Photography',
            description: 'Coverage by senior candid photographer',
            price: 45000,
            total: 45000
          },
          {
            service: 'Pre-Wedding Shoot',
            description: 'Including 2 min pre-wedding cinematic video',
            price: 20000,
            total: 20000
          }
        ],
        subTotal: 150000,
        discount: 0,
        total: 150000,
        advancePaid: 50000,
        advancePaymentDate: '2026-06-10',
        advancePaymentMethod: 'UPI / NetBanking',
        totalPaid: 50000,
        balance: 100000,
        status: 'partial',
        notes: 'Balance payment due on or before wedding shoot delivery.'
      },
      {
        invoiceNo: 'CWF-0002',
        date: new Date('2026-06-12'),
        client: {
          name: 'Sneha & Rahul',
          phone: '8765432109'
        },
        event: 'Reception Ceremony',
        eventDate: '2026-07-20',
        location: 'Grand Castle Palace Grounds, Bangalore',
        services: [
          {
            service: 'Candid Photography',
            description: 'Candid wedding moments coverage',
            price: 45000,
            total: 45000
          },
          {
            service: 'Traditional Photography',
            description: 'Traditional coverage plus premium album',
            price: 40000,
            total: 40000
          }
        ],
        subTotal: 85000,
        discount: 0,
        total: 85000,
        advancePaid: 85000,
        advancePaymentDate: '2026-06-12',
        advancePaymentMethod: 'Credit Card',
        totalPaid: 85000,
        balance: 0,
        status: 'paid',
        notes: 'Invoice fully settled. Thank you for booking CWF.'
      },
      {
        invoiceNo: 'CWF-0003',
        date: new Date('2026-06-14'),
        client: {
          name: 'Ananya & Vikram',
          phone: '7654321098'
        },
        event: 'Engagement Ceremony',
        eventDate: '2026-09-02',
        location: 'Crystal Room, Taj Lands End, Mumbai',
        services: [
          {
            service: 'Wedding Teaser',
            description: 'Cinematic teaser covering the event highlights',
            price: 30000,
            total: 30000
          },
          {
            service: 'Candid Photography',
            description: 'Engagement Candid highlights',
            price: 35000,
            total: 35000
          }
        ],
        subTotal: 65000,
        discount: 0,
        total: 65000,
        advancePaid: 15000,
        advancePaymentDate: '2026-06-14',
        advancePaymentMethod: 'UPI',
        totalPaid: 15000,
        balance: 50000,
        status: 'partial',
        notes: 'Remaining balance payment of 50,000 INR to be paid on date of event.'
      }
    ];
    await Invoice.insertMany(invoicesData);

    res.json({ message: 'Professional demo data successfully seeded!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error seeding database with demo data.' });
  }
});

module.exports = router;
