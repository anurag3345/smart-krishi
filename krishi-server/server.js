const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



//connect to mongodb
connectDB()

app.use('/api/auth', require('./routes/authRoutes'));



const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Backend server is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

