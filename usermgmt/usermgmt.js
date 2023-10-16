const express = require('express');
const userrouter = express.Router();

userrouter.use(express.json())
userrouter.use(express.urlencoded({ extended: true }));
const { GetUser, AddUser, DeleteUser, VerifyUserLogin, testdb, deletetest } = require('../crud/crud')



function generateAccessToken(username) {
    const currentTime = Date.now().toString();
    const hashedUsername = crypto.createHash('md5').update(username).digest('hex');

    // Concatenate the current time and hashed username
    const tokenData = currentTime + hashedUsername;

    // Generate a hash of the token data
    const accessToken = crypto.createHash('sha256').update(tokenData).digest('hex');
    return accessToken;
}


userrouter.get('/signup', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/signup.html')
})

userrouter.get('/login', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/login.html')
})

userrouter.get('/updateavatar', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/updateavatar.html')
})
userrouter.get('/model/avatar/:id', (req, res) => {
    console.log(req.params.id)
    res.sendFile(process.env.PROJECT_DIR + '/Models/avatar/' + req.params.id + '.gltf')

})
userrouter.route('/test').post((req, res) => {
    const data = req.body;
    const task = testdb(data);
    res.status(201).json({ task });

})
userrouter.route('/deltest').post((req, res) => {
    const data = req.body;
    deletetest(data).
        then((message) => {
            res.status(201).json({ message });
        })
        .catch((error) => {
            res.status(201).json({ error });
        });
})

userrouter.put('/updateavatar', (req,res) => {
    res.status(501);
})

userrouter.route('/signup').post((req, res) => {
    //console.log(req.body.username, req.body.password)
    AddUser(req.body.username, req.body.password)
        .then((message) => {
            res.status(201).send( message );
        }).catch((error) => {
            res.status(401).send(error );
        })
});


userrouter.route('/delete').post((req, res) => {
    if (req.body.pwd === process.env.DELETE_PASSWORD ) {
        DeleteUser(req.body.username, req.body.password)
            .then((message) => {
                res.status(201).json({ message });
            }).catch((error) => {
                res.status(401).json({ error });
            })
    } else {
        res.status(403).send("Access denied");
    }

});

userrouter.route('/login').post((req, res) => {
    //console.log(req.body.username, req.body.password)
    VerifyUserLogin(req.body.username, req.body.password)
        .then((message) => {
            if (message.body === "") {
                res.status(201).send("please enter avatar details before entering");
            } else {
                const data = { username: message.username, cookie: generateAccessToken(message.username), ttl: "86400", body: message.body };

                res.status(200).json(data);
            }
    }).catch((error) => {
        res.status(401).send( error );
    });
}
);

userrouter.route('/loginOauth').get((req, res) => {
    res.status(501);
})


userrouter.route('/').get((req,res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/index.html')
})

/*userrouter.route('/').all((req,res)=> {
    res.status(404).send("Invalid Address");
})*/

module.exports = {
    userrouter
};