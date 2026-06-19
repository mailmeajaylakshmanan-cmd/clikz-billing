const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Lead Photographer', 'Photographer', 'Cinematographer', 'Drone Pilot', 'Editor', 'Assistant'] },
  dayRate: Number,
  baseDayRate: Number,
  phone: String,
  status: { type: String, default: 'Available' }
}, { timestamps: true });

// Sync dayRate with baseDayRate in pre-save
employeeSchema.pre('save', function(next) {
  if (this.baseDayRate !== undefined && this.dayRate === undefined) {
    this.dayRate = this.baseDayRate;
  } else if (this.dayRate !== undefined && this.baseDayRate === undefined) {
    this.baseDayRate = this.dayRate;
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
