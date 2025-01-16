const express = require('express');
const app = express();
require('dotenv').config({path: '../.env'});
const cors = require('cors');
const connectDB = require('./src/db'); // Import the connectDB function
connectDB(); // Call the connectDB function
const userRoutes = require('./src/routes/userRoutes');


app.use(express.json());
app.use(cors());


app.use('/', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));