const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://realtimepollingsystemfrontend.onrender.com',
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const pollRoutes = require('./routes/pollRoutes');
app.use('/api/polls', pollRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT ||5000, () => console.log('Server running on port 5000'));
})
.catch(err => console.error("Mongo error:", err));
