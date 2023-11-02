
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

/*app.all('*', (req, res, next) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});
*/
app.use(userrouter);
app.get('/auth/google', (req, res) => {
    if (!req.session.user) {
        req.session.user = {}
    }
    req.session.user = " what is this string just store data";
    passport.authenticate('google')
});
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/loginOauth'
}));
app.use(passport.initialize());

const start = async () => {
    try {
        const sessionvar = await connectDB();
        app.use(sessionvar);
        //app.listen(3000,console.log("Started server"))
    }
    catch (error) {
        console.log(error);
    }
}
httpsServer.listen(443,console.log("Listening on https port, yay were live"));

start();
