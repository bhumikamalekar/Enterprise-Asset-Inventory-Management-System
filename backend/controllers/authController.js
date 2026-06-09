const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

// Validation schemas
const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'DEPARTMENT').default('DEPARTMENT'),
    department: Joi.string().optional()
});

const loginSchema = Joi.object({

    username: Joi.string().required(),
    password: Joi.string().required()
});

const login = async (req, res) => {
    try {
        console.log('Login attempt received:', req.body);
        const { error } = loginSchema.validate(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { username, password } = req.body;
        console.log(`Checking password for: ${username}`);
        const user = await User.findByUsername(username);

        if (!user) {
            console.log(`No user found for username: ${username}`);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match for ${username}: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ 
        accessToken: newAccessToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            department: user.department
        }
    });
};


const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out successfully' });
};

const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, email, password, role, department } = req.body;
        
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = await User.addUser({ username, email, password, role, department });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                department: newUser.department
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        const safeUsers = users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role,
            department: u.department
        }));
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

module.exports = {
    login,
    refresh,
    logout,
    register,
    getUsers
};


