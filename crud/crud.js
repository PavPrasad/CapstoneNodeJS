
const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    username: String,
    password: String,
    body: String,
})

const Player = mongoose.model('player', playerSchema);

const loggedInSchema = new mongoose.Schema({
    username: String,
    sessionid: String,
    body: String,
})
const connectDB = async (url) => {
    await mongoose.connect(url, { useNewUrlParser: true })
}

const MyModel = mongoose.model('Test', new mongoose.Schema({ username: String, password: String }));
const testdb = async (data) => {
    console.log(data)
    const test = new MyModel(data);
    await test.save()
    console.log(test)
    return test;
}
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
            console.log(existingUser)
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
        const newPlayer = new Player({ username, password });
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
    return new Promise((resolve, reject) => {
        const existingUser = Player.findOne({ username, password });
        if (existingUser) {
            console.log(existingUser)
            resolve(existingUser);
        } else {
            reject("Username or passord incorrect");
        }
    });
}

module.exports = {
    connectDB,
    GetUser,
    AddUser,
    DeleteUser,
    VerifyUserLogin,
    testdb,
    deletetest
};

