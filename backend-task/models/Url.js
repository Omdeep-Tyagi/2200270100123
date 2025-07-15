const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      location: String
    }
  ]
});

module.exports = mongoose.model('Url', urlSchema);
