
const express = require('express');
const { router, ini } = require('./usermgmt/usermgmt.js');
require('dotenv').config()
const { connectDB } = require('./crud/crud')


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

const start = async () => {
    try {
        ini(process.env.PROJECT_DIR, process.env.DELETE_PASSWORD)
        app.use(router);
        await connectDB(process.env.MONGO_URI)
    }
    catch (error) {
        console.log(error);
    }
}
start();
httpServer.start();
httpsServer.start();