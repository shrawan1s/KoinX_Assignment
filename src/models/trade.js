import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
    utc_time: { type: Date, required: true },
    operation: { type: String, required: true },
    market: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^[A-Z]+\/[A-Z]+$/.test(value),
            message: props => `${props.value} is not a valid market format! Use BASE/QUOTE format.`
        }
    },
    amount: { type: Number, required: true },
    price: { type: Number, required: true }
});

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;
