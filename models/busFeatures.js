const mongoose = require('mongoose');

// Define the BusFeatures schema
const busFeaturesSchema = new mongoose.Schema({
  bus_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'BusType', // Reference to the BusType model
  },
  feature_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Feature', // Reference to the BusFeature model
  },
});

// Create and export the BusFeatures model
const BusFeatures = mongoose.model('BusFeatures', busFeaturesSchema);

module.exports = BusFeatures;


