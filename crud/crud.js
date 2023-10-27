
const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    username: String,
    password: String,
    body: String,
})

const Player = mongoose.model('player', playerSchema);


const connectDB = async (url) => {
    await mongoose.connect(url, { useNewUrlParser: true })
}
/*
const MyModel = mongoose.model('Test', new mongoose.Schema({ username: String, password: String }));
const testdb = async (data) => {
    console.log(data)
    const test = new MyModel(data);
    await test.save()
    console.log(test)
    return test;
}
*/
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
            console.log(existingUser)
            resolve(existingUser);
        } else {
            console.log("What the ??")
            reject("Username or passord incorrect");
        }
    });
}
//add schema to store cookie details and to verify details

const CookieSchema = new mongoose.Schema({
    username: String,
    cookie: String,
    expiry: Date
})
const Cookie = mongoose.model("cookiestorage", CookieSchema);

const CheckCookie = (username, cookie) => {
    return new Promise(async (resolve, reject) => {
        console.log(username, cookie)
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
        await Player.updateOne({ username, password }, { $set: { body: playerbody } })
        console.log('Document updated successfully.');
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
                console.log("THIS" + isCookie)
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
    addBodyDetails
};

/*
Debugger attached.
express-session deprecated undefined resave option; provide resave option app.js:29:9
express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:29:9
Started server
{
  _id: new ObjectId("652e6e8bf22eb017252b39aa"),
  username: 's3h',
  password: 'fff',
  body: 'aksjdhf',
  __v: 0
}
CastError: Cast to string failed for value "{
  _id: new ObjectId("652e6e8bf22eb017252b39aa"),
  username: 's3h',
  password: 'fff',
  body: 'aksjdhf',
  __v: 0
}" (type Object) at path "username" for model "player"
    at SchemaString.cast (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\schema\string.js:606:11)
    at SchemaType.applySetters (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\schematype.js:1220:12)
    at SchemaString.castForQuery (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\schema\string.js:690:15)
    at cast (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\cast.js:298:34)
    at Query.cast (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\query.js:4911:12)
    at Query._castConditions (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\query.js:2232:10)    at model.Query._updateThunk (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\query.js:3855:8)
    at model.Query._updateOne (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\query.js:3965:23)
    at model.Query.exec (D:\Sem7\Capstone\CapstoneNodeJS\CapstoneNodeJS\node_modules\mongoose\lib\query.js:4430:28)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  stringValue: '"{\n' +
    '  _id: new ObjectId("652e6e8bf22eb017252b39aa"),\n' +
    "  username: 's3h',\n" +
    "  password: 'fff',\n" +
    "  body: 'aksjdhf',\n" +
    '  __v: 0\n' +
    '}"',
  messageFormat: undefined,
  kind: 'string',
  value: {
    _id: new ObjectId("652e6e8bf22eb017252b39aa"),
    username: 's3h',
    password: 'fff',
    body: 'aksjdhf',
    __v: 0
  },
  path: 'username',
  reason: null,
  valueType: 'Object',
  model: Model { player }
}
*/