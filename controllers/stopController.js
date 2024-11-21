// controllers/stopController.js

const Stop = require('../models/stops'); // Adjust the path as needed

// Create a new stop
exports.createStop = async (req, res) => {
    const { stopName } = req.body;
  
    const stop = new Stop({ stopName });
    
    try {
      const savedStop = await stop.save();
      res.status(201).json(savedStop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all stops or filtered stops based on query
exports.getAllStops = async (req, res) => {
  console.log("entering get alll...");
  
    const { query } = req.query; // Destructure the query from request query
  
    try {
      const filter = query ? { stopName: new RegExp(query, 'i') } : {}; // Case-insensitive regex
      const stops = await Stop.find(filter);
      res.status(200).json(stops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Update a stop by ID
exports.updateStopById = async (req, res) => {
    const { stopName } = req.body;
    try {
      const updatedStop = await Stop.findByIdAndUpdate(req.params.id, { stopName }, { new: true });
      if (!updatedStop) return res.status(404).json({ message: 'Stop not found' });
      res.status(200).json(updatedStop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Delete a stop by ID
exports.deleteStopById = async (req, res) => {
    try {
      const deletedStop = await Stop.findByIdAndDelete(req.params.id);
      if (!deletedStop) return res.status(404).json({ message: 'Stop not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
