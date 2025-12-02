const express = require('express');
const { getTransactionsForWallet, getTransaction } = require('../controllers/transaction.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/wallet/:walletId', auth, getTransactionsForWallet);
router.get('/:id', auth, getTransaction);

module.exports = router;