const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user/userRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());

// Public Routes
app.use('/auth', authRoutes);

// Protected Routes
app.use('/user', authMiddleware, userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
