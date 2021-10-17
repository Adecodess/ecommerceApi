//  require router
const router = require('express').Router();

// require auth controller
const { register, login, verifyUser } = require('../controllers/auth');

// rroute for register user
router.post('/register', register);
router.post('/login', verifyUser, login);

module.exports = router;
