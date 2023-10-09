const express = require('express');
const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({ extended: true }));
const { GetUser, AddUser, DeleteUser, VerifyUserLogin, testdb, deletetest } = require('../crud/crud')

function ini(a,b) {
    PROJECT_DIR = a
    DELETE_PASSWORD = b
}

function generateAccessToken(username) {
    const currentTime = Date.now().toString();
    const hashedUsername = crypto.createHash('md5').update(username).digest('hex');

    // Concatenate the current time and hashed username
    const tokenData = currentTime + hashedUsername;

    // Generate a hash of the token data
    const accessToken = crypto.createHash('sha256').update(tokenData).digest('hex');
    return accessToken;
}


router.get('/signup', (req, res) => {
    res.sendFile(PROJECT_DIR + '/Webpages' + '/signup.html')
})

router.get('/login', (req, res) => {
    res.sendFile(PROJECT_DIR + '/Webpages' + '/login.html')
})

router.get('/updateavatar', (req, res) => {
    res.sendFile(PROJECT_DIR + '/Webpages' + '/updateavatar.html')
})
router.get('/model/avatar/:id', (req, res) => {
    console.log(req.params.id)
    res.sendFile(PROJECT_DIR + '/Models/avatar/' + req.params.id + '.gltf')

})
router.route('/test').post((req, res) => {
    const data = req.body;
    const task = testdb(data);
    res.status(201).json({ task });

})
router.route('/deltest').post((req, res) => {
    const data = req.body;
    deletetest(data).
        then((message) => {
            res.status(201).json({ message });
        })
        .catch((error) => {
            res.status(201).json({ error });
        });
})

router.route('/signup').post((req, res) => {
    console.log(req.body.username, req.body.password)
    AddUser(req.body.username, req.body.password)
        .then((message) => {
            res.status(201).send( message );
        }).catch((error) => {
            res.status(401).send(error );
        })
});


router.route('/delete').post((req, res) => {
    if (req.body.pwd === DELETE_PASSWORD ) {
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

router.route('/serverLogin').post((req, res) => {
    console.log(req.body.username, req.body.password)
    VerifyUserLogin(req.body.username, req.body.password)
        .then((message) => {
        res.status(201).json({ message });
    }).catch((error) => {
        res.status(401).send( error );
    });
}
);

module.exports = {
    router,
    ini
}; 