const express = require('express');
const passport = require('passport');
const { GetOauthUser, AddOauthUser } = require('../crud/crud')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://' + process.env.DOMAIN_NAME + '/auth/google/callback',
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
    const ttl = 3600;
    GetOauthUser(user.id)
        .then((message) => {
            done(null, message);
        })
        .catch((error) => {
            const msg = AddOauthUser(user.id, user.displayname, user.email);
            done(null, msg);
        })
    done(null, user);

}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email, displayname: user.displayname });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


module.exports = {
    passport
};

