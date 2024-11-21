// controllers/busTypeController.js

const BusType = require('../models/busTypes'); // Import the BusType model

// Create a new bus type
exports.createBusType =  async (req, res) => {
    const { bus_type_name, amenities } = req.body;
  
    const busType = new BusType({
      bus_type_name,
      amenities,
    });
  
    try {
      const savedBusType = await busType.save();
      res.status(201).json(savedBusType);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all bus types
exports.getAllBusTypes =async (req, res) => {
    console.log("eneterd here..");
    
  try {
    const busTypes = await BusType.find();
    res.status(200).json(busTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single bus type by ID
exports.getBusTypeById = async (req, res) => {
    try {
      const busType = await BusType.findById(req.params.id);
      if (!busType) return res.status(404).json({ message: 'Bus Type not found' });
      res.status(200).json(busType);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Update a bus type by ID
exports.updateBusType = async (req, res) => {
  const { bus_type_name, amenities } = req.body;
  try {
    const updatedBusType = await BusType.findByIdAndUpdate(
      req.params.id,
      { bus_type_name, amenities },
      { new: true }
    );

    if (!updatedBusType) {
      return res.status(404).json({ message: 'Bus Type not found' });
    }

    res.status(200).json(updatedBusType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bus type by ID
exports.deleteBusType = async (req, res) => {
    try {
      const deletedBusType = await BusType.findByIdAndDelete(req.params.id);
      if (!deletedBusType) return res.status(404).json({ message: 'Bus Type not found' });
      res.status(200).json({ message: 'Bus Type deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
