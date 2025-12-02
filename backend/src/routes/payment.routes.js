const express = require('express');
const { createPayment, getPayment, getPaymentByOrderId, updatePaymentStatus, confirmPayment } = require('../controllers/payment.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createPayment);
router.get('/:id', auth, getPayment);
router.get('/order/:merchantOrderId', auth, getPaymentByOrderId);
router.patch('/:id/status', auth, updatePaymentStatus);
router.post('/:id/confirm', auth, confirmPayment);

module.exports = router;