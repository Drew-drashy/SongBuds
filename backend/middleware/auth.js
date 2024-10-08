const jwt = require('jsonwebtoken');
const User = require('../Model/user');

module.exports = async function(req, res, next) {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, Authorization denied!' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, Authorization denied!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find user by ID from the decoded token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        req.user = user; // Set the user document on req.user
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
