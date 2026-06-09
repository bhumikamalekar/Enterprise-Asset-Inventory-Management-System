const { verifyAccessToken } = require('../utils/tokenUtils');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        if (decoded) {
            req.user = decoded;
            return next();
        }
        
        return res.status(401).json({ message: 'Token expired or invalid' });
    }

    res.status(401).json({ message: 'Authentication token required' });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = {
    authenticateJWT,
    authorizeRoles
};
