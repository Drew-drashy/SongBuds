const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamps: {
        type: Date,
        default: Date.now,
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        sparse: true,
    },
    avatar: {
        type: String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [MessageSchema],
    currentlyListening: {
        songId: {
            type: String,
            default: null,
        },
        timestamp: {
            type: Date,
            default: null,
        },
    },
    date: {
        type: Date,
        default: Date.now,
    },
    // New Spotify-specific fields
    spotify_id: {
        type: String,
        unique: true,
        sparse: true
    },
    spotifyAccessToken: {
        type: String
    },
    spotifyRefreshToken: {
        type: String
    },
    spotifyTokenExpires: {
        type: Date
    },
    spotifyScope: {
        type: String
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);