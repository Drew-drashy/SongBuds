const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { upload } = require('../Config/cloudinary.js');
const User = require('../Model/user.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    // console.log('hiii');
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Upload avatar
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.avatar = req.file.path;  // Cloudinary URL
        await user.save();

        res.json({ avatar: user.avatar });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a friend
router.post('/add-friend', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(req.body.friendId);

        if (!friend) {
            return res.status(404).json({ msg: 'Friend not found' });
        }

        if (user.friends.includes(friend.id)) {
            return res.status(400).json({ msg: 'Friend already added' });
        }

        user.friends.push(friend.id);
        friend.friends.push(user.id);

        await user.save();
        await friend.save();

        res.json({ msg: 'Friend added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove a friend
router.post('/remove-friend', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(req.body.friendId);

        if (!friend) {
            return res.status(404).json({ msg: 'Friend not found' });
        }

        user.friends = user.friends.filter(friendId => friendId.toString() !== friend.id);
        friend.friends = friend.friends.filter(friendId => friendId.toString() !== user.id);

        await user.save();
        await friend.save();

        res.json({ msg: 'Friend removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get messages between the user and a friend
router.get('/messages/:friendId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const friendId = req.params.friendId;

        if (!user.friends.includes(friendId)) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const messages = user.messages.filter(
            message => message.receiver.toString() === friendId || message.sender.toString() === friendId
        );

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// Get currently playing song for a friend
router.get('/currently-listening/:friendId', auth, async (req, res) => {
    try {
        const friend = await User.findById(req.params.friendId);

        if (!friend) {
            return res.status(404).json({ msg: 'Friend not found' });
        }

        res.json(friend.currentlyListening);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
