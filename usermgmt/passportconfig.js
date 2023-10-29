const express = require('express');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://' + process.env.DOMAIN_NAME+'/auth/google/callback',
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const displayname = profile.displayName;
    const user = {
        id: profile.id,
        displayname,
        email
    };

    console.log(user)
    // Return the user object to Passport
    done(null, user);
}));



module.exports = {
    passport
};