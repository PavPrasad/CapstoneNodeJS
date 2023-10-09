const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    // Get the user's email address from the Google profile.
    const email = profile.emails[0].value;
    // Find the user in your database.
    const user = await User.findOne({ email });
    // If the user doesn't exist, create them.
    if (!user) {
        user = new User({ email });
        await user.save();
    }
    // Return the user to Passport.
    done(null, user);
}));

