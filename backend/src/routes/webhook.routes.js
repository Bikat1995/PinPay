const express = require('express');
const { receiveTelebirr, receiveCBEBirr, listWebhooks, getWebhook } = require('../controllers/webhook.controller');
const router = express.Router();

router.post('/telebirr', receiveTelebirr);
router.post('/cbebirr', receiveCBEBirr);
router.get('/', listWebhooks);
router.get('/:id', getWebhook);

module.exports = router;