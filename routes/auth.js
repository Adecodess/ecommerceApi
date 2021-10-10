//  require router
const router = require('express').Router();

// require auth controller
const { register, login } = require('../controllers/auth');

// rroute for register user
router.post('/register', register);
router.post('/login', login);

module.exports = router;
