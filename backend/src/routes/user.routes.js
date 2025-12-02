const express = require('express');
const { register, login, getMe, updateProfile, getUserById } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.patch('/update', auth, updateProfile);
router.get('/:id', auth, getUserById);

module.exports = router;