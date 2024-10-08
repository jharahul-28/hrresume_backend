const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/',(req, res)=>{
    res.send("Welcome");
})

module.exports = router;
