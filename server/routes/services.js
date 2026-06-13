const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Predefined wedding film services — fallback if DB is empty
const defaultServices = [
  { name: 'Engagement', descriptions: ['Traditional', 'Candid', 'Candid & Traditional'] },
  { name: 'Wedding', descriptions: ['Traditional', 'Candid', 'Candid & Traditional', 'Cinematic'] },
  { name: 'Reception', descriptions: ['Traditional', 'Candid', 'Candid & Traditional'] },
  { name: 'Pre-wedding Shoot', descriptions: ['Outdoor', 'Studio', 'Outdoor & Studio'] },
  { name: 'Album', descriptions: ['12x15 inch', '15x18 inch', 'Coffee Table Book'] },
  { name: 'Video Edit', descriptions: ['Highlight Film', 'Full Documentary', 'Cinematic Edit'] },
  { name: 'Drone Shoot', descriptions: ['Half Day', 'Full Day'] },
];

router.get('/', auth, async (req, res) => {
  try {
    let services = await Service.find().sort({ name: 1 });
    if (services.length === 0) {
      // Seed if empty
      await Service.insertMany(defaultServices);
      services = await Service.find().sort({ name: 1 });
    }
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
