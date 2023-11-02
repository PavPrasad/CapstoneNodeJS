const express = require('express');
const passport = require('passport');
const { GetOauthUser, GetTempOauthUser, AddOauthUser } = require('../crud/crud')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://' + process.env.DOMAIN_NAME+'/auth/google/callback',
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
}, async (profile, done) => {
    console.log(profile);
    req.session.message = profile;
    /*
    const email = profile.emails[0].value;
    const displayname = profile.displayName;
    const user = {
        id: profile.id,
        displayname,
        email
    };
    const ttl = 3600;
   req.session.user = user;
    console.log(req.session.user);
    GetOauthUser(user.id)
        .then((message) => {
            req.session.message = message;
            console.log(message);
            done(null, message);
        })
        .catch((error) => {
            const msg = AddOauthUser(user.id, user.displayname, user.email,ttl);
            console.log(msg);
            req.session.message = msg;
            done(null, msg);
        })*/
    console.log(`done for ${user.displayname} `);
    done(null);
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