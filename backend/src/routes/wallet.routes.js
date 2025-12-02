const express = require('express');
const { createWallet, getWalletsForUser, getWallet, creditWallet, debitWallet } = require('../controllers/wallet.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createWallet);
router.get('/user/:userId', auth, getWalletsForUser);
router.get('/:id', auth, getWallet);
router.post('/:id/credit', auth, creditWallet);
router.post('/:id/debit', auth, debitWallet);

module.exports = router;