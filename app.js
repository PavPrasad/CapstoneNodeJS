
require('dotenv').config()

const express = require('express');
//const passport = require('passport');
const session = require('express-session');

const { userrouter } = require('./usermgmt/usermgmt');
const { connectDB } = require('./crud/crud');
const { passport } = require('./usermgmt/passportconfig');

const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();


const domain = process.env.DOMAIN_NAME;
const certificate = fs.readFileSync('./certificate.pem');
const privateKey = fs.readFileSync('./privateKey.pem');


const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    cert: certificate,
    key: privateKey,
}, app);

httpServer.listen(80);
httpsServer.listen(443);

app.all('*', (req, res, next) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});


app.use(userrouter);

app.use(session({
    secret: 'YOUR_SESSION_SECRET'
}));
app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
app.use(passport.initialize());
app.use(passport.session());

const start = async () => {
    try {
        console.log("begin")
        //iniuser(process.env.PROJECT_DIR, process.env.DELETE_PASSWORD)
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, console.log("Started Listenting at 3000"));
    }
    catch (error) {
        console.log(error);
    }
}
start();
httpServer.start();
httpsServer.start();