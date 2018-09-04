const Order = require('../models/orders');
const config = require('../config');
const moment = require('moment');
const _ = require('lodash');
const { orderStatus } = config.constants;

const createOrder = (userId) => {
    return new Order({
        userId,
        status: orderStatus.NEW,
        products: [],
        createdAt: moment().format(),
        updatedAt: moment().format()
    }).save();
}

const addProductsToOrder = (userId, products = []) => {
    return findActiveOrder(userId).then((result) => {
        console.info('found the order -> ', result);
        _.forEach(products, function (product) {
            let findProduct = _.find(result.products, { productId: product.productId });
            if (findProduct) {
                findProduct.cartQty = findProduct.cartQty + 1;
            } else {
                result.products = result.products.concat(products);
            }
        });
        result.updatedAt = moment().format();
        saveToMongo(result);
        return result;
    });
}

const removeProductsFromOrder = (userId, products = []) => {
    return findActiveOrder(userId).then((result) => {
        products.forEach(productId => {
            let updatedProducts = _.remove(result.products, function (product) {
                return product.productId === productId;
            });
            console.info('updatedProducts-->', updatedProducts);
        });
        console.info('result.products-->', result.products);
        result.updatedAt = moment().format();
        saveToMongo(result);
        return result;
    });
}

const saveToMongo = (order) => {
    const productstoadd = order.products
    const orderId = order.orderId;
    const { userId, products } = order;
    return Order.findOneAndUpdate(
        { orderId: orderId },
        order,
        {
            new: true,
            fields: {
                updatedAt: order.updatedAt,
                products: productstoadd
            }
        }, (updatedOrder) => updatedOrder);
}

const getStatus = (orderId) => {
    return Order.findOne({ orderId }).then(result => result.status);
}

const findActiveOrder = (userId) => {
    return Order.findOne({ userId, status: orderStatus.NEW });
}

const findAllOrders = (userId) => {
    return Order.find({ userId: userId });
}

const updateOrder = (orderId, transactionId, paymentMode, status, address) => {

    return getOrderById(orderId).then(order => {
        console.info('found order-->', order);
        order.transactionId = transactionId;
        order.paymentMode = paymentMode;
        order.status = status;
        order.orderAddress = address;
        return order.save();
    });
}

const getOrderById = orderId => {
    return Order.findOne({ orderId: orderId });
}

// const updateOrderDetails = (orderId, orderAddress, orderPostalCode)  => {
//     return Order.findOneAndUpdate(
//         { orderId },
//         {},
//         {
//             new: true,
//             fields: {
//                 updatedAt: moment().format(),
//                 orderAddress,
//                 orderPostalCode
//             }
//         }, (updatedOrder) => updatedOrder);
// }

module.exports = {
    createOrder,
    addProductsToOrder,
    getStatus,
    findActiveOrder,
    findAllOrders,
    updateOrder,
    removeProductsFromOrder,
    getOrderById
    //updateOrderDetails,
}