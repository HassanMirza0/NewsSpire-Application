const express = require('express')
const router=express.Router()
const authController=require('../controllers/authController')
const authMiddleware = require('../middleware/auth'); 


router.get('/',authMiddleware,authController.getHomepage)
router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)
router.get('/register',authController.getRegister)
router.post('/register',authController.postRegister)
router.get('/logout', authController.logout);
// Route to show forgot password form
router.get('/forgot-password', authController.getForgotPassword);

// Route to handle submission of forgot password form
router.post('/forgot-password', authController.postForgotPassword);

// Route to show reset password form
router.get('/reset-password', authController.getResetPassword);

// Route to handle submission of reset password form
router.post('/reset-password', authController.postResetPassword);

module.exports = router