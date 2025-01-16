require('dotenv').config()
import mongoose from 'mongoose';

const dbUrl: string = process.env.DB_URL as string;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to databse");
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
};

export default connectToDatabase;