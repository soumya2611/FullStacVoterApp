const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const db = require('./db')
require('dotenv').config(); 
const PORT = process.env.PORT || 3000;  
app.use(
  cors({
    origin:"*", 
    credentials: true,
  })
);
const userRoutes = require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes')
//Using the routes
app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes)
app.get('/', (req, res) => {
    res.send("welcome to online voting app")
})
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})