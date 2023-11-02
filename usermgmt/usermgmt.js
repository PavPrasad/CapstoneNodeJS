const express = require('express');
const userrouter = express.Router();
const crypto = require('crypto');
userrouter.use(express.json())
userrouter.use(express.urlencoded({ extended: true }));

const {
    AddUser,
    DeleteUser,
    VerifyUserLogin,
    deletetest,
    CheckCookie,
    DeleteCookie,
    AddCookie,
    addBodyDetails,
    GetOauthUser,
    AddOauthUser
} = require('../crud/crud');

function generateAccessToken(e) {
    let t = Date.now().toString(), a = crypto.createHash("md5").update(e).digest("hex"),
    n = crypto.createHash("sha256").update(t + a).digest("hex"); return n
}

userrouter.get('/signup', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/signup.html')
})

userrouter.get('/login', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/login.html')
})

userrouter.get('/favicon.ico', (req, res) => {
    res.sendFile(process.env.PROJECT_DIR + '/Webpages' + '/favicon.ico')
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

userrouter.get('/download', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Download Pesumetaversity VR Application</title>
</head>
<body>
  <h1>Download Files</h1>
  <p>This page provides links to download two files from a Google Cloud Platform (GCP) bucket.</p>
  <p>Please note that these files are provided as-is, without any warranty or guarantee of working.</p>
  <p>Use the SteamVR Runtime with SteamVR Enabled if the standard runtime does not work</p>
  <ul>
    <li><a href="${process.env.GCP_DOWNLOAD_URL_STANDARD}">Standard VR runtime</a></li>
    <li><a href="${process.env.GCP_DOWNLOAD_URL_STEAMVR}">SteamVR Runtime application</a></li>
  </ul>
</body>
</html>`);
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
    console.log(req.body.username, req.body.password)
    VerifyUserLogin(req.body.username, req.body.password)
        .then((message) => {
            if (message.body === "") {
                res.status(201).send("please enter avatar details before entering");
            } else {
                AddCookie(message.username, generateAccessToken(message.username), myttl)
                    .then((message2) => {
                        console.log(message2.cookie)
                        const data = {
                            username: message.username, cookie: message2.cookie,
                            ttl: myttl, body: message.body
                        };
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
    CheckCookie(req.body.username, req.body.Cookie)
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


userrouter.route('/signupOauth').post((req, res) => {
    console.log(req.body.username, req.body.password);

})

userrouter.route('/loginOauth').post((req, res) => {
    console.log(req.body.username, req.body.password);
})

userrouter.route('/loginOauth').get((req, res) => {
    //just have the user enter the details temporarily
    console.log("YEAH", req.session.message);
    res.status(200).send(req.session.message);
})

userrouter.route('/loginOauth').post((req, res) => {
    res.status(501).send('not implemented');
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