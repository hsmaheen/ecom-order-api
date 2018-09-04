// const Order = require('../models/orders');
const OrderService = require('../services/OrderService');
const config = require('../config');
const {
    orderStatus
} = config.constants;

//Cors Config
const enableCors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
}


// if "NEW" order exists, then it will return the active order. 
// if no active order, then it creates new order. 
const createOrder = (req, res) => {
    const {
        userId
    } = req.query;
    OrderService.findActiveOrder(userId)
        .then((result) => {
            if (result) {
                return res.send(result);
            }
            OrderService.createOrder(userId).then(order => {
                return res.send(order);
            });
        })
        .catch(err => handleError(err, res));
}

// list fo all orders made by user. 
const list = (req, res) => {
    const {
        userId
    } = req.params;
    OrderService.findAllOrders(userId)
        .then(orders => res.send({
            orders: orders
        }))
        .catch(err => handleError(err, res));
}

// gives the status of the given order.
const getStatus = (req, res) => {
    const {
        orderId
    } = req.query;
    OrderService.getStatus(orderId)
        .then(result => res.send(result))
        .catch(err => handleError(err, res));
}

// adds product to the cart.
const addToCart = (req, res) => {
    const {
        userId,
        products
    } = req.body;
    OrderService.findActiveOrder(userId)
        .then((result) => {
            if (result) {
                return result;
            }
            return OrderService.createOrder(userId).then(order => order);
        }).then(() => {
            console.info(`addProductsToOrder ${userId, products}`);
            OrderService.addProductsToOrder(userId, products)
                .then(result => {
                    if (result) {
                        return res.send(result);
                    }
                    return res.send(500);
                }).catch(err => handleError(err, res));
        })
        .catch(err => handleError(err, res));
}

// updates the status of the order to paid.
const updateStatus = (req, res) => {
    const {
        orderId,
        transactionId,
        paymentMode,
        address
    } = req.body;
    const {
        status
    } = req.params;
    let updateStatus = getOrderStatus(status);
    OrderService.updateOrder(
        orderId,
        transactionId,
        paymentMode,
        updateStatus,
        address
    ).then(order => res.send({
        order: order
    }))
        .catch(err => handleError(err, res));

}

// common error handler to avoid duplication.
const handleError = (err, res) => {
    console.error(err);
    return res.send(500);
}

// maps the route status to order status
const getOrderStatus = status => {
    let updatedStatus;
    switch (status) {
        case 'Paid':
            updatedStatus = orderStatus.PAYMENT_COMPLETED;
            break;
        case 'PaymentStarted':
            updatedStatus = orderStatus.PAYMENT_IN_PROGRESS;
            break;
        case 'PaymentFailed':
            updatedStatus = orderStatus.PAYMENT_FAILED;
            break;
        default:
            updatedStatus = orderStatus.NEW;
    }
    return updatedStatus;
}

const removeFromCart = (req, res) => {
    const {
        userId,
        products
    } = req.body;
    OrderService.removeProductsFromOrder(userId, products)
        .then(result => {
            if (result) {
                return res.send(result);
            }
            return res.send(500);
        }).catch(err => handleError(err, res));
}

const getActiveOrder = (req, res) => {
    const {
        userId
    } = req.params;
    OrderService.findActiveOrder(userId)
        .then((order) => {
            if (order) {
                return res.send({
                    order: order
                });
            } else {
                return res.send({
                    order: null
                });

            }
            return res.send(500);
        })
        .catch(err => handleError(err, res));
}

const getOrder = (req, res) => {
    const {
        orderId
    } = req.params;
    OrderService.getOrderById(orderId)
        .then((order) => {
            if (order) {
                return res.send({
                    order: order
                });
            }
            return res.send(500);
        })
        .catch(err => handleError(err, res));
}

module.exports = {
    createOrder,
    list,
    getStatus,
    updateStatus,
    enableCors,
    addToCart,
    removeFromCart,
    getActiveOrder,
    getOrder,
}