const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  basePrice: { type: Number, default: 0 },
  descriptions: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
