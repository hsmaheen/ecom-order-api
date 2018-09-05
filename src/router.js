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
router.get('/order/active/:userId', orderController.getActiveOrder);
router.get('/order/:orderId', orderController.getOrder);
router.get('/orders/:userId', orderController.list);   
router.put('/order/status/:status', orderController.updateStatus);
router.post('/order/cart', orderController.addToCart);
router.post('/order/cart/remove', orderController.removeFromCart);

// deprecated
router.post('/order/create', orderController.createOrder);

module.exports = router;