import express from 'express';
import multer from 'multer';
import csv from 'csvtojson';
import fs from 'fs';
import Trade from '../models/trade.js';
import tradeSchema from '../schemas/tradeSchema.js';

// Creating an Express router instance
const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// POST endpoint for uploading a CSV file
router.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;

    try {
        // Convert CSV to JSON using csvtojson
        const jsonArray = await csv().fromFile(filePath);
        // Array to store validated trade objects
        const results = [];
        // Track if any validation errors occurred
        let validationFailed = false;

        // Iterating over each row of the JSON array
        for (let data of jsonArray) {
            try {
                // Validate and format data according to schema
                await tradeSchema.validate({
                    User_ID: data.User_ID,
                    UTC_Time: new Date(data.UTC_Time),
                    Operation: data.Operation.toLowerCase(),
                    Market: data.Market,
                    'Buy/Sell Amount': parseFloat(data['Buy/Sell Amount']),
                    Price: parseFloat(data.Price)
                }, { abortEarly: false });

                // Creating a trade object for MongoDB insertion
                const trade = {
                    user_id: data.User_ID,
                    utc_time: new Date(data.UTC_Time),
                    operation: data.Operation.toLowerCase(),
                    market: data.Market,
                    amount: parseFloat(data['Buy/Sell Amount']),
                    price: parseFloat(data.Price)
                };
                // Adding validated trade to results array
                results.push(trade);
            } catch (validationError) {
                validationFailed = true;
                console.error(`Validation error: ${validationError.errors}`);
            }
        }

        if (validationFailed) {
            res.status(400).send('Data is not processed correctly. Validation error.');
        } else {
            await Trade.insertMany(results);
            res.status(200).send('Data stored successfully');
        }
    } catch (error) {
        res.status(500).send('Error processing CSV', error);
    } finally {
        // Clean up: delete the uploaded file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

export default router;
