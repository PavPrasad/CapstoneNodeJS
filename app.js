
const express = require('express');
const { router, ini } = require('./usermgmt/usermgmt.js');
require('dotenv').config()
const { connectDB } = require('./crud/crud')

const app = express();


const port = 3000;


const start = async () => {
    try {
        ini(process.env.PROJECT_DIR, process.env.DELETE_PASSWORD)
        app.use(router);
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
}

start();