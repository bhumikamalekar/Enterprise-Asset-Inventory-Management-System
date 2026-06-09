const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

// Admin user management
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), authController.getUsers);

// Example protected route for testing
router.get('/me', authenticateJWT, (req, res) => {
    res.json({ user: req.user });
});

// Example admin only route
router.get('/admin-only', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
