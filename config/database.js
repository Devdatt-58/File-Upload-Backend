const mongoose = require('mongoose');
require('dotenv').config();

exports.connectWithDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed");
        console.error(error.message);
        process.exit(1);
    }
};

