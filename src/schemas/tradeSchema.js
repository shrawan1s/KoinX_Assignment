import * as yup from 'yup';

// Define the schema using yup
const tradeSchema = yup.object().shape({
    User_ID: yup.string().required('User ID is required'),
    UTC_Time: yup.date().required('UTC Time is required'),
    Operation: yup.string().required('Operation is required'),
    Market: yup.string().required('Market is required'),
    'Buy/Sell Amount': yup.number().positive('Amount must be positive').required('Amount is required'),
    Price: yup.number().positive('Price must be positive').required('Price is required')
});

export default tradeSchema;
