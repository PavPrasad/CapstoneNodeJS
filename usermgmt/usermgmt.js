const express = require('express');
const userrouter = express.Router();
const crypto = require('crypto');
userrouter.use(express.json())
userrouter.use(express.urlencoded({ extended: true }));
let ejs = require('ejs');


const {
    AddUser,
    DeleteUser,
    VerifyUserLogin,
    deletetest,
    CheckCookie,
    DeleteCookie,
    AddCookie,
    addBodyDetails,
    AddOauthBody,
    GetUser
} = require('../crud/crud');

function generateAccessToken(e) {
    let t = Date.now().toString(), a = crypto.createHash("md5").update(e).digest("hex"),
    n = crypto.createHash("sha256").update(t + a).digest("hex"); return n
}

userrouter.get('/signup', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/signup.html')
})

userrouter.get('/login', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/login.ejs')
})

userrouter.get('/favicon.ico', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/favicon.ico')
})

userrouter.get('/updateavatar', (req, res) => {
    if (!req.session.userdetails) {
    }
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

userrouter.get('/download', (req, res) => {
    res.render(process.env.PROJECT_DIR + '/Webpages' + '/download.ejs');
});

userrouter.post('/updateavatar', (req, res) => {
    VerifyUserLogin(req.body.username, req.body.password)
        .then((message) => {
            addBodyDetails(message.username,message.password,req.body.body)
            res.status(200).send("Finished updating details");
        })
        .catch(() => {
            res.status(404).send("Username or password incorrect");
        });
})

userrouter.route('/signup').post((req, res) => {
    //console.log(req.body.username, req.body.password)
    AddUser(req.body.username, req.body.password)
        .then((message) => {
            res.status(201).send(message);
        }).catch((error) => {
            res.status(401).send(error);
        })
});


userrouter.route('/delete').post((req, res) => {
    if (req.body.pwd === process.env.DELETE_PASSWORD) {
        DeleteUser(req.body.username, req.body.password)
            .then((message) => {
                DeleteCookie(message.username);
                res.status(201).json({ message });
            }).catch((error) => {
                res.status(401).json({ error });
            })
    } else {
        res.status(403).send("Access denied");
    }
});

myttl = "86400000"
userrouter.route('/login').post((req, res) => {
    VerifyUserLogin(req.body.username, req.body.password)
        .then((message) => {
            if (message.body === "NA") {
                res.status(201).send("please enter avatar details before entering");
            } else {
                AddCookie(message.username, generateAccessToken(message.username), myttl)
                    .then((message2) => {
                        const data = {
                            username: message.username, cookie: message2.cookie,
                            ttl: myttl, body: message.body
                        };

                        req.session.userdetails = data;
                        req.session.save();
                        res.status(200).json(data);
                    }).catch((error) => {
                        console.log(error);
                        res.status(500).send("Some error in saving cookies on the server");
                    });
            }
        })
        .catch((error) => {
            res.status(401).send(error);
        });
}
);

userrouter.route('/unityLogin').post((req, res) => {
    CheckCookie(req.body.username, req.body.cookie)
        .then((cookiedetails) => {
            console.log(cookiedetails);
            const a = new Date();
            if (cookiedetails.expiry > a) {
                res.status(200).send("Login Successful");
            } else {
                res.status(201).send("Please Login, this error must not be visible")
                DeleteCookie(req.body.username)
                    .then(() => {
                        console.log("user", req.body.username, "Has been deleted")
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }).catch((error) => {

            res.status(404).send("cookie incorrect");
        })
})

userrouter.route('/getavatar').post((req, res) => {
    //if (req.params.username) {
        GetUser(req.params.username)
            .then((message) => {
                res.status(200).send(message.body);
            })
            .catch((error) => {
                res.status(401).send(error);
            })
/*    } else {
        res.status(404).send("invalid input");
    }*/
});

userrouter.route('/signupOauth').post((req, res) => {
    if (!req.session.passport.user) {
        res.redirect('/auth./google');
    } else {
        AddOauthBody(req.session.passport.user.id, req.body.body); 
        res.status(201).send("Body successfully updated , you can login to APP using email temporarily")
    }
})

userrouter.route('/loginOauth').get((req, res) => {
    //just have the user enter the details temporarily
    if (!req.session.passport.user) {
        res.redirect('/auth/google');
    }
    else {
        const data = req.session.passport.user;
        res.status(200).render(process.env.PROJECT_DIR + '/Webpages' + '/OauthPage.ejs', { data });
    }

})


userrouter.route('/').get((req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/index.html')
})

/*userrouter.route('/').all((req,res)=> {
    res.status(404).send("Invalid Address");
})*/

module.exports = {
    userrouter
};