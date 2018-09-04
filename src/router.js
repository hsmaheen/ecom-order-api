var express = require('express');
var versionHealthcheck = require('version-healthcheck');
var expressHealthcheck = require('express-healthcheck');
var orderController = require('./controllers/OrderController');

/* Initialize router */
const router = express.Router();

/* Monitoring and Healthchecks */
router.use(orderController.enableCors);
router.use('/up', expressHealthcheck());
router.get('/version', versionHealthcheck);
router.get('/order/new/:userId', orderController.getActiveOrder);
router.get('/order/get/:orderId', orderController.getOrder);
// router.post('/order/update', orderController.updateOrderDetails);
router.get('/orders/user/:userId', orderController.list);   
router.get('/order/status', orderController.getStatus);
router.post('/order/status/:status', orderController.updateStatus);
router.post('/order/cart/add', orderController.addToCart);
router.post('/order/cart/remove', orderController.removeFromCart);

// depricated
router.post('/order/create', orderController.createOrder);

module.exports = router;