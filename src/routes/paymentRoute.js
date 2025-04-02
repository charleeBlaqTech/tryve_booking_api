const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentsController');
const guestMiddleware = require('../middlewares/auth.and.permissions/guestWare');
const adminMiddleWare = require('../middlewares/auth.and.permissions/adminRoleWare');
const studentMiddleWare = require('../middlewares/auth.and.permissions/studentRoleWare');
const authMiddleWare = require('../middlewares/auth.and.permissions/authWare');



// router.post('/initialize-payment-budpay/', PaymentController.checkout);
// router.post('/web-hook-verify/', PaymentController.checkout);
router.post('/initialize-payment/', PaymentController.checkout);
router.get('/verify-payment/:reference', PaymentController.verify_payment);

module.exports = router;