// models/Stop.js
const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true,
  },
});

const Stop = mongoose.model('Stop', stopSchema);

module.exports = Stop;

