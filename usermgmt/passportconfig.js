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
    var msg=user;
    await GetOauthUser(user.id)
        .then((message) => {
            msg = message;
        })
        .catch((error) => {
            console.log(error);
            const message = AddOauthUser(user.id, user.displayname, user.email);
            msg = message;
        })
    done(null, msg);
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

