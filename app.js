
require('dotenv').config()

const express = require('express');
const { userrouter } = require('./usermgmt/usermgmt');
const { connectDB } = require('./crud/crud');
const { passport } = require('./usermgmt/passportconfig');

const https = require('https');
const fs = require('fs');

const app = express();
const certificate = fs.readFileSync('/etc/letsencrypt/live/' + process.env.DOMAIN_NAME +'/fullchain.pem');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/'+process.env.DOMAIN_NAME+'/privkey.pem');

const httpsServer = https.createServer({
    cert: certificate,
    key: privateKey,
}, app);

const start =  () => {
    try {
        const sessionvar =  connectDB();
        app.use(sessionvar);
    }
    catch (error) {
        console.log(error);
    }
}
start();
app.use(passport.initialize());
httpsServer.listen(443, console.log("Listening on https port, yay were live"));

app.set('view engine', 'ejs');

//app.use(passport.authenticate('session'));

app.use(userrouter);
app.get('/auth/google',
    passport.authenticate('google'),
    (req, res) => {
    res.status(201).send();
});
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/loginOauth',
    failureRedirect: '/'
}));
