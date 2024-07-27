const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/products',productRoutes);
app.use('/admins',userRoutes);
app.use('/managers',userRoutes);
app.use('/moderators',userRoutes)
app.use('/companies',userRoutes)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


