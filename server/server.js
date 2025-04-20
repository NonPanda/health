const express = require('express');
const app = express();
require('dotenv').config({path: '../.env'});
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/db'); 
connectDB(); 
const userRoutes = require('./src/routes/userRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes.js');
const appointmentRoutes = require('./src/routes/appointment.js');
const medicationRoutes = require('./src/routes/medications.js');

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL||"http://localhost:3000",
    credentials: true,
}));


app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/medications', medicationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));