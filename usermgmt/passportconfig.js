const express = require('express');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
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
    //todo handle all user details into mongo use the crud app etc

    done(null, user);
}));



module.exports = {
    passport
};