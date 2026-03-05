const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');
const staffController = require('../controllers/staffController');
const systemController = require('../controllers/systemController');
const reportController = require('../controllers/reportController');

const adminMiddleware = require('../middlewares/adminMiddleware');
const staffMiddleware = require('../middlewares/staffMiddleware');

// Route để get system
router.get('/', staffMiddleware.sessionStaff, systemController.getProductSystem);

// Route để post system
router.post('/', staffMiddleware.sessionStaff, systemController.postAddProduct);

// Router để post search 
router.post('/search', staffMiddleware.sessionStaff, systemController.postAddProduct1)

// Route để get payment
router.get('/payment', staffMiddleware.sessionStaff, systemController.getPaymentSystem);

// Route để get payment
router.post('/payment', staffMiddleware.sessionStaff, systemController.postPaymentSystem);

// Route để clear product
router.get('/clear', systemController.postClearProduct);

// Route để post số lượng
router.post('/set-quantity-product', staffMiddleware.sessionStaff, systemController.postSetQuantityProduct);

// Route để delete sản phẩm
router.delete('/delete-product/:id', staffMiddleware.sessionStaff, systemController.deleteDeleteProduct);

module.exports = router;