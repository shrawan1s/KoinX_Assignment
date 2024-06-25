import mongoose from 'mongoose';

// Defining the schema for the 'Trade' collection
const tradeSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    utc_time: { type: Date, required: true },
    operation: { type: String, required: true },
    market: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true }
});

// Creating the 'Trade' model based on the schema
const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
