const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require("./config/db1");
require("dotenv").config();

const app = express();
connectDB();
app.use(express.json());


const userRoutes=require("./routes/userRoutes1");
const routeRoutes = require('./routes/routeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const busRoutes = require('./routes/busRoutes');
const busTypeRoutes = require('./routes/busTypeRoutes');
const driverRoutes = require('./routes/driverRoutes');
const stopRoutes = require('./routes/stopRoutes');






app.use('/', userRoutes);
app.use('/', routeRoutes);
app.use('/api', bookingRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bus-types', busTypeRoutes);
app.use('/api', driverRoutes);
app.use('/api/stops', stopRoutes);

 
module.exports = app;



