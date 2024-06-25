import * as yup from 'yup';

const tradeSchema = yup.object().shape({
    UTC_Time: yup.date().required('UTC_Time is required'),
    Operation: yup.string().oneOf(['buy', 'sell'], 'Operation must be buy or sell').required('Operation is required'),
    Market: yup.string()
        .matches(/^[A-Z]+\/[A-Z]+$/, 'Market must be in the format BASE/QUOTE and contain only uppercase letters')
        .required('Market is required'),
    'Buy/Sell Amount': yup.number().positive('Amount must be positive').required('Amount is required'),
    Price: yup.number().positive('Price must be positive').required('Price is required')
});

export default tradeSchema;
