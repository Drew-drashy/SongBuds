const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../Model/user.js'); 

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URL,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        // Find or create user logic
        let user = await User.findOne({ spotifyId: profile.id });
        console.log(clientID,'client')
        if (!user) {
          user = new User({
            spotifyId: profile.id,
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null, // Spotify sometimes returns email
            avatar: profile.photos[0] ? profile.photos[0].url : null, // Avatar URL from Spotify
            accessToken, // Store accessToken to make API requests later
          });
          await user.save();
        } else {
          // If the user exists, update the token
          user.accessToken = accessToken;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
