import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Loading environment variables from .env file
dotenv.config()

// Connecting to MongoDB using Mongoose
const connect = mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to Database');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

export default connect
