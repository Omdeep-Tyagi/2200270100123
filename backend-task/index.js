const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require("./config/dbConnection");
const logger = require('./middlewares/logger.middleware');
const shortUrlRoutes = require('./routes/shortUrlRoutes');

connectDb();
app.use(express.json());
app.use(logger); // Custom middleware for basic logs
app.use('/shorturls', shortUrlRoutes);

const port=process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
});
