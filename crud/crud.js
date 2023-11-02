
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session);

const connectDB =  () => {
     mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    return session({
        secret: process.env.SECRET_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            maxAge: 30
        },
        store: new MongoStore({
            databaseName: 'sessions',
            uri: process.env.MONGO_URI,
            ttl: 30,
            autoRemove: 'native'
        })
    })
}

const playerSchema = new mongoose.Schema({
    username: String,
    password: String,
    body: String,
})
const Player = mongoose.model('player', playerSchema);
const deletetest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await MyModel.deleteOne(data);
            if (result.deletedCount === 1) {
                resolve("Deleted successfully");
            } else {
                reject("No matching document found to delete");
            }
        } catch (error) {
            reject("Error deleting document: " + error);
        }
    });
};
const GetUser = (username) => {
    return new Promise((resolve, reject) => {
        const existingUser = Player.findOne({ username });
        if (existingUser) {
            resolve(existingUser);
        } else {
            reject("User not found");
        }
    });
};
const AddUser = async (username, password) => {
    try {
        const existingUser = await GetUser(username);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const newPlayer = new Player({ username, password, "body": "" });
        await newPlayer.save();

        return "Player added";
    } catch (error) {
        return error.message;
    }
};
const DeleteUser = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Player.deleteOne({ username, password })
            if (result.deletedCount == 1) {
                resolve("Succesfully deleted user" + username)
            } else {
                reject("User not found");
            }
        } catch (error) {
            reject(error);
        }
    });
};
const VerifyUserLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        const existingUser = await Player.findOne({ username, password });
        if (existingUser) {
            //console.log(existingUser)
            resolve(existingUser);
        } else {
            //console.log("What the ??")
            reject("Username or passord incorrect");
        }
    });
}

const CookieSchema = new mongoose.Schema({
    username: String,
    cookie: String,
    expiry: Date
})
const Cookie = mongoose.model("cookiestorage", CookieSchema);
const CheckCookie = (username, cookie) => {
    return new Promise(async (resolve, reject) => {
        //console.log(username, cookie)
        const isCookie = await Cookie.findOne({ username, cookie });
        if (isCookie) {
            //we dont check ttl here
            resolve(isCookie);
        } else {
            reject("Cookie not found");
        }
    });
}
const addBodyDetails = async (username, password, playerbody) => {
    try {
        const data = await Player.findOne({ username, password });
        data.body = playerbody;
        await data.save();
        //console.log('Document updated successfully.');
    } catch (err) {
        console.error(err);
    };
}
const AddCookie = (username, cookie, ttl) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isCookie = await Cookie.findOne({ username });

            // Check if the same user has a cookie and delete it if it exists
            if (isCookie) {
                await Cookie.deleteOne({ username });
                //console.log("THIS" + isCookie)
            }
            const d = new Date();
            d.setTime(d.getTime() + Number(ttl));
            const expiry = d;

            const data = { username, cookie, expiry }
            // Insert the new cookie
            const newLogin = new Cookie(data);
            await newLogin.save();

            resolve(data);
        } catch (error) {
            reject(error); // Handle any errors that occur during the process
        }
    });
}
const DeleteCookie = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isCookie = await Cookie.findOne({ username });
            // Check if the same user has a cookie and delete it if it exists
            if (isCookie) {
                await Cookie.deleteOne({ username });
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
}

const OauthSchema = new mongoose.Schema({
    id : String,
    displayname: String,
    email: String,
    body: String
})
const Oauth = mongoose.model("OauthStorage", OauthSchema);
const AddOauthUser = async(id,displayname,email) => {
    try {
        const existingUser = await GetOauthUser(id);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const newPlayer = new Oauth({ id, displayname,email, "body": "" });
        await newPlayer.save();

        return "Oauth Player added";
    } catch (error) {
        return error.message;
    }
}
const GetOauthUser = (id) => {
    return new Promise((resolve, reject) => {
        const existingUser = Oauth.findOne({ id });
        if (existingUser) {
            resolve(existingUser);
        } else {
            reject("User not found");
        }
    });
};

const TimeOauthSchema = new mongoose.Schema({
    id: String,
    displayname: String,
    email: String,
    Expiry: Date
})
const TempOauth = mongoose.model("TempOauth", TimeOauthSchema);
const AddTempOauthUser = async (id, displayname, email,ttl) => {
    try {
        const existingUser = await GetOauthUser(id);
        if (existingUser) {
            throw new Error(" Temporary user already exists");
        }
        const d = new Date();
        d.setTime(d.getTime() + Number(ttl));
        const expiry = d;

        const newPlayer = new tempOauth({ id, displayname, email,expiry });
        await newPlayer.save();

        return "Temp Oauth Player added";
    } catch (error) {
        return error.message;
    }
}
const GetTempOauthUser = (id) => {
    return new Promise((resolve, reject) => {
        const existingUser = TempOauth.findOne({ id });
        if (existingUser) {
            resolve(existingUser);
        } else {
            reject("User not found");
        }
    });
};
const DeleteTempOauthUser = (id, displayname, email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isCookie = await GetOauthUser(id);
            // Check if the same user has a cookie and delete it if it exists
            if (isCookie) {
                await Cookie.deleteOne({ id, displayname, email });
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
}




module.exports = {
    connectDB,
    GetUser,
    AddUser,
    DeleteUser,
    VerifyUserLogin,
    deletetest,
    CheckCookie,
    DeleteCookie,
    AddCookie,
    addBodyDetails,
    GetOauthUser,
    AddOauthUser,
    AddTempOauthUser,
    GetTempOauthUser,
    DeleteTempOauthUser
};
