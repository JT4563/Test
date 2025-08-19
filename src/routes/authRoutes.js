
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['candidate', 'hr', 'admin'])
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

module.exports = router;
