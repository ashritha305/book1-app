const Route = require('../models/routes');
const Stop = require('../models/stops');
const Bus = require('../models/bus');

// Middleware for error handling
const handleError = (res, error) => {
    console.error("Error:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
};

// Create a new route
const createRoute = async (req, res) => {
    console.log("Entered inside post routes");

   const { starting_stop_id, ending_stop_id, duration, distance, bus_id,fare } = req.body;
   // console.log("req.body:"+req.body);
   

   const route = new Route({
       starting_stop_id,
       ending_stop_id,
       duration,
       distance,
       bus_id,
       fare, // Include bus_id
   });

   // console.log("route:"+route);
   

   try {
       const newRoute = await route.save();
       res.status(201).json(newRoute);
   } catch (error) {
       handleError(res, error);
   }
};

// Get all routes for Route Management
const getRoutes =  async (req, res) => {
    try {
        // Fetch all routes from the database where bus status is true
        const routes = await Route.find()
            .populate({
                path: 'starting_stop_id',
                // select: 'name' // Select only necessary fields for stops (optional)
            })
            .populate({
                path: 'ending_stop_id',
                // select: 'name' // Select only necessary fields for stops (optional)
            })
            .populate({
                path: 'bus_id',
                match: { bus_status: true },  // Only populate buses where bus_status is true
                select: 'bus_number bus_status arrival_time no_of_seats '  // You can select specific fields from the bus (optional)
            });

        // Filter out any routes where the bus_status is false or bus_id is null (in case no bus is matched)
        const filteredRoutes = routes.filter(route => route.bus_id);
    //    console.log("filteredRoutes:"+filteredRoutes);
       

        // Create a structured response including necessary details
        const response = filteredRoutes.map(route => ({
            _id: route._id,
            starting_stop_id: route.starting_stop_id,
            ending_stop_id: route.ending_stop_id,
            bus_id: route.bus_id,
            bus_number: route.bus_id ? route.bus_id.bus_number : null, // Include bus number from bus_id
            duration: route.duration,
            distance: route.distance,
            fare:route.fare,
            
        }));

        // console.log("response:"+response);
        

        // Log and return the response
        // console.log("Response sent:", response);
        return res.json(response);
    } catch (error) {
        console.error("Error occurred:", error);
        handleError(res, error);
    }
};

// Get route details for Home Screen
const getRouteDetails = async (req, res) => {
    console.log("Entered route details endpoint...");

    const { from, to, date } = req.query; // Extract query parameters
    console.log("Request Query: " + JSON.stringify(req.query));

    try {
        // Validate and format the date from the query parameter
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        // Set the start of the day (00:00:00) and end of the day (23:59:59) based on the provided date
        const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0)); // 00:00:00
        const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999)); // 23:59:59

        // Fetch the ObjectIds of the from and to stops based on stop names
        const fromStop = await Stop.findOne({ stopName: from }).select('_id');
        const toStop = await Stop.findOne({ stopName: to }).select('_id');

        // If either stop is not found, return an error
        if (!fromStop || !toStop) {
            return res.status(404).json({ message: 'One or both of the stops not found.' });
        }

        // Get the current date and time
        const currentTime = new Date();

        // Query the routes and buses based on starting/ending stops and the arrival time
        const routes = await Route.find({
            starting_stop_id: fromStop._id,  // Use the ObjectId of the from stop
            ending_stop_id: toStop._id,      // Use the ObjectId of the to stop
        })
            .populate('starting_stop_id', 'stopName') // Populate starting stop name
            .populate('ending_stop_id', 'stopName')   // Populate ending stop name
            .populate({
                path: 'bus_id',
                select: 'bus_number bus_status remaining_seats available_seats arrival_time no_of_seats driver_id bus_type',
                match: { 
                    bus_status: true, // Only select buses that are active
                    arrival_time: { 
                        $gte: startOfDay,  // Arrival time must be greater than or equal to the start of the day
                        $lt: endOfDay      // Arrival time must be less than the end of the day
                    }
                },
                populate: [
                    {
                        path: 'bus_type', // Populate the bus type
                        select: 'bus_type_name amenities' // Select bus_type_name and amenities from bus_type
                    },
                    {
                        path: 'driver_id', // Populate the driver
                        select: 'name' // Select driver_name from driver_id
                    }
                ]
            })
            .exec();

        // If no routes are found, return a 404 status
        if (routes.length === 0) {
            return res.status(404).json({ message: 'No routes found for the selected criteria.' });
        }

        // Map over the routes to format the response
        const responseRoutes = routes.map(route => {
            const bus = route.bus_id; // Get the bus details
            if (!bus || !bus.bus_type || !bus.driver_id) {
                return null; // Skip this route if there's no bus, bus type, or driver
            }

            const arrivalTime = new Date(bus.arrival_time);
            const timeDifferenceInMinutes = (arrivalTime - currentTime) / 1000 / 60; // Time difference in minutes

            // Only include buses if the gap between current time and arrival time is at least 30 minutes
            if (timeDifferenceInMinutes < 30) {
                return null; // Skip this bus if the gap is less than 30 minutes
            }

            return {
                route_id: route._id,
                starting_stop_name: route.starting_stop_id.stopName,
                ending_stop_name: route.ending_stop_id.stopName,
                bus_number: bus.bus_number,
                bus_id: bus._id,
                fare: route.fare,
                duration: route.duration,
                distance: route.distance,
                available_seats: bus.available_seats,
                remaining_seats: bus.remaining_seats,
                bus_type_name: bus.bus_type.bus_type_name, // Use the bus type name here
                bus_status: bus.bus_status,
                arrival_time: bus.arrival_time,
                amenities: bus.bus_type.amenities, // Extract amenities from bus_type
                driver_name: bus.driver_id.name // Extract driver name from driver_id
            };
        }).filter(route => route !== null); // Remove any null entries if no matching bus was found

        res.status(200).json(responseRoutes); // Return the list of routes

    } catch (error) {
        console.error('Error fetching route details:', error);
        res.status(500).json({ error: 'Failed to fetch route details.' });
    }
};

// Update a route by ID
const updateRoute =  async (req, res) => {
    console.log("Entered inside PUT routes");

    const { starting_stop_id, ending_stop_id, duration, distance, bus_id,fare } = req.body;
    
    // Log the request body
    console.log("Request body:", req.body);

    try {
        // Check if all required fields are present
        if (!starting_stop_id || !ending_stop_id || !duration || !distance || !bus_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        console.log("Request parameters ID:", req.params.id);
        console.log("Starting Stop ID:", starting_stop_id);
        console.log("Ending Stop ID:", ending_stop_id);
        console.log("Duration:", duration);
        console.log("Distance:", distance);
        console.log("Bus ID:", bus_id);
        
        // Attempt to update the route
        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            { starting_stop_id, ending_stop_id, duration, distance, bus_id,fare },
            { new: true, runValidators: true } // Ensure validation runs on update
        );

        // Log the updated route
        // console.log("Updated Route:", updatedRoute);
        
        // Check if the route was found and updated
        if (!updatedRoute) {
            console.log("Route not found for ID:", req.params.id);
            return res.status(404).json({ message: 'Route not found' });
        }
        
        // console.log("Route updated successfully.");
        res.json(updatedRoute);
    } catch (error) {
        console.error("Error updating route:", error); // Improved error logging
        handleError(res, error);
    }
};


// Delete a route by ID
const deleteRoute = async (req, res) => {
    console.log("Entered inside DELETE route");

    try {
        // Find the route by ID
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        console.log("route.bus_id:"+route.bus_id);
        
        // Find the associated bus
        const bus = await Bus.findById(route.bus_id);
        if (bus) {
            // Set isAvailable to true
            bus.isAvailable = true;
            await bus.save(); // Save the updated bus
        }

        // Delete the route
        await Route.findByIdAndDelete(req.params.id);

        // Respond with a success message
        res.status(200).json({ message: 'Route deleted successfully, bus marked as available.' });
    } catch (error) {
        console.error("Error deleting route:", error); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createRoute,
    getRoutes,
    getRouteDetails,
    updateRoute,
    deleteRoute
};
