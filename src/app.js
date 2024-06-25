import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoute from './routes/upload.js';
import './db.js';

// Loading environment variables from .env file
dotenv.config()
// Creating an Express application
const app = express();
// Getting the port number from environment variables
const PORT = process.env.PORT;

// Middleware to parse JSON bodies in requests
app.use(express.json());
// Middleware to enable CORS for all routes
app.use(cors())
// Mounting the upload route under /api path
app.use('/api', uploadRoute);

// Starting the server and logging the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
