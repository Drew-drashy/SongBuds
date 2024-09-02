const express = require('express');
const bcrypt = require('bcrypt');
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
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        // console.log(email);
        // console.log(password);
        // console.log(user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);
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
        // Log the incoming request
        console.log('Received a request to upload an avatar');
        console.log('Request user ID:', req.user.id);
        console.log('Uploaded file information:', req.file);

        // Verify if auth middleware worked and user is found
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify if the file was correctly uploaded by multer/cloudinary
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Update user's avatar URL with Cloudinary path
        user.avatar = req.file.path;  // Ensure this path is correct
        await user.save();

        console.log('Avatar updated successfully');
        res.json({ avatar: user.avatar });
    } catch (err) {
        console.error('Server error:', err.message);
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
        console.log(user.id);
        console.log(friendId);
        // friendId=friendId.split(':');
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
