// this file is used to connect to the database and show us if the mongodb is connected or not
const mongoose = require('mongoose');

const connectDB = async () => { 
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
 };

 module.exports = connectDB;