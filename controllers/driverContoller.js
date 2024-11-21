// controllers/driverController.js

const Driver = require('../models/driver'); // Import the Driver model

// 1. Fetch drivers based on status or all drivers if no status is provided
exports.getDrivers = async (req, res) => {
    try {
      const status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : null;
      
      // If status is provided, filter by it
      const drivers = status !== null ? await Driver.find({ driver_status: status }) : await Driver.find();
      
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching drivers' });
    }
  };

// 2. Add a new driver
exports.addDriver = async (req, res) => {
    console.log("entered inside post..");
    
    const { name, email, mobile } = req.body;
    
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const newDriver = new Driver({ name, email, mobile });
      await newDriver.save();
      res.status(201).json(newDriver);  // Respond with the newly created driver
    } catch (error) {
      console.error('Error adding driver:', error);
      res.status(500).json({ message: 'Failed to add driver' });
    }
  };

// 3. Update an existing driver
exports.updateDriver =  async (req, res) => {
    const { name, email, mobile } = req.body;
    const { id } = req.params;
  
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const driver = await Driver.findByIdAndUpdate(
        id, 
        { name, email, mobile },
        { new: true }  // Return the updated driver
      );
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      res.status(200).json(driver);  // Respond with the updated driver
    } catch (error) {
      console.error('Error updating driver:', error);
      res.status(500).json({ message: 'Failed to update driver' });
    }
  };
  

// 4. Update driver status (e.g., deactivate or reactivate driver)
exports.updateDriverStatus = async (req, res) => {
    const { driver_status } = req.body; // expects driver_status in the body
    try {
      const driver = await Driver.findByIdAndUpdate(req.params.id, { driver_status }, { new: true });
      res.json(driver);
    } catch (err) {
      res.status(500).json({ message: 'Error updating driver status' });
    }
  };

// 5. Delete a driver
exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
  
    try {
      const driver = await Driver.findByIdAndDelete(id);  // Delete the driver by ID
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
      console.error('Error deleting driver:', error);
      res.status(500).json({ message: 'Failed to delete driver' });
    }
  };