const express = require('express');
const connectDB = require('./config/dbConnection.js');
const authRoutes = require('./routes/auth.routes.js');
const cors = require('cors')
require('dotenv').config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
