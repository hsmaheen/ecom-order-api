const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const OrderModel = {
    orderId: { type: String, default: () => new ObjectId() },
    userId: String,
    status: String,
    products: { type: Array, default: [] },
    paymentMode: { type: String, default: "" },
    transactionId: { type: String, default: "" },
    orderAddress: { type: String, default: "" },
    orderPostalCode: { type: String, default: "" },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
};

const OrderSchema = new Schema(OrderModel, {
    title: 'recurringAudit',
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
