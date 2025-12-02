const express = require('express');
const userRoutes = require('./user.routes');
const walletRoutes = require('./wallet.routes');
const paymentRoutes = require('./payment.routes');
const transactionRoutes = require('./transaction.routes');
const webhookRoutes = require('./webhook.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/wallets', walletRoutes);
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;