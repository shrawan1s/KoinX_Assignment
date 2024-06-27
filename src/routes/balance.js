import express from 'express';
import Trade from '../models/trade.js';

// Creating an Express router instance
const router = express.Router();

// POST endpoint for calculating asset-wise balances at a given timestamp
router.post('/balance', async (req, res) => {
    // Extract timestamp from request body
    const { timestamp } = req.body;

    // Validate the presence of the timestamp
    if (!timestamp) {
        // Return a 400 Bad Request response if timestamp is missing
        return res.status(400).send({ error: 'Timestamp is required' });
    }

    // Convert timestamp to a Date object
    const date = new Date(timestamp);
    // Validate if the timestamp is a valid date
    if (isNaN(date.getTime())) {
        // Return a 400 Bad Request response if the timestamp format is invalid
        return res.status(400).send({ error: 'Invalid timestamp format' });
    }

    try {
        // Call function to calculate balances up to the given date
        const balances = await calculateBalances(date);
        // Send calculated balances as a JSON response
        res.status(200).send(balances);
    } catch (error) {
        // Return a 500 Internal Server Error response in case of any errors
        res.status(500).send({ error: 'Error calculating balances' });
    }
});

// Function to calculate asset-wise balances up to a specific timestamp
const calculateBalances = async (date) => {
    // Fetch trades from the database that occurred on or before the given date
    const trades = await Trade.find({ utc_time: { $lte: date } }).exec();

    // Initialize an empty object to store the balance for each asset
    const balances = {};

    // Iterate over each trade to compute the balances
    trades.forEach(trade => {
        // Extract the base asset from the market field (e.g., BTC from BTC/INR)
        const asset = trade.market.split('/')[0];

        // Determine the amount to add or subtract based on the operation
        // Buy operations add to the balance, Sell operations subtract from the balance
        const amount = trade.operation === 'buy' ? trade.amount : -trade.amount;

        // Initialize the balance for the asset if it doesn't exist
        if (!balances[asset]) {
            balances[asset] = 0;
        }

        // Update the balance for the asset
        balances[asset] += amount;
    });

    // Return the calculated balances
    return balances;
}

export default router;
