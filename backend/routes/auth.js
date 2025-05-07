const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');
const { checkAuth } = require('../middleware/auth');

// مسارات المصادقة
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/user', authController.getUser);

// مسارات التحقق من رقم الهاتف
router.post('/verify-phone', checkAuth, verificationController.verifyPhoneCode); // التحقق من رقم الهاتف
router.post('/resend-verification', checkAuth, verificationController.resendVerificationCode); // إعادة إرسال رمز التحقق
router.get('/verification-status', checkAuth, verificationController.checkVerificationStatus); // حالة التحقق

module.exports = router;
