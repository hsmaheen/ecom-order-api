module.exports = {
    serverPort: process.env.PORT || 3100,
    // mongoDBUrl: process.env.MONGODB_URL || 'mongodb://127.0.0.1/local',
    mongoDBUrl: process.env.MONGODB_URL || 'mongodb+srv://hsmaheen:VxK40wZtx1MvyOoo@cluster0-nheri.gcp.mongodb.net/test?retryWrites=true',
    constants: {
        orderStatus: {
            NEW: "NEW",
            PAYMENT_IN_PROGRESS: "PAYMENT_IN_PROGRESS",
            PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
            PAYMENT_FAILED: "PAYMENT_FAILED",
            OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
            DELIVERED: "DELIVERED"
        }
    }
};