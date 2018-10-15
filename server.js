const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const db = require('./models')
const config = require('./config/config')
const passport = require('./config/passport')

// const key = process.env.SECRET_KEY


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

//html endpoints
//STILL NEED TO RESTRICT ACCESS WITH VERIFYTOKEN
app.get('/', (req, res) => 
    res.sendFile(__dirname + '/views/index.html'));

app.get('/main', (req, res) => 
    res.sendFile(__dirname + '/views/main.html'));

app.get('/profile', (req, res) => 
    res.sendFile(__dirname + '/views/profile.html'));

app.get('/about', (req, res) => 
    res.sendFile(__dirname + '/views/about.html'));

app.post('/verify', verifyToken, (req, res) => {
    let verified = jwt.verify(req.token, 'key')
    res.json(verified)
})


//api endpoints
app.get('/artist', (req, res) => res.json(artist));
app.get('/song', (req, res) => res.json(song));

app.get('/api', (req, res) => {
    res.json({
        endpoints: [
            {method: "GET", path: "/api", description: "Describes all available endpoints"},
            {method: "GET", path: "/api/users", description: "View all users"}, 
            {method: "GET", path: "/api/songs", description: "View all songs"}, 
            {method: "GET", path: "/api/artists", description: "View all artists"}, 
            {method: "GET", path: "/api/user/:id", description: "View all users by id"}, 
            {method: "GET", path: "/api/comments", description: "View all comments"},
            {method: "POST", path: "/api/signup", description: "Sign up users"},
            {method: "POST", path: "/api/login", description: "User log in"}
        ]
    })
});

app.post('/api/signup', (req, res) => {
    db.User.find({username: req.body.username})
    .select('+password')
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "user already exists"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){ 
                    res.status(500).json({error: err})
                } else {
                    const userToCreate = new db.User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                    });
                    db.User.create(userToCreate, (err, newUser) => {
                        if(err){console.log(err);}
                            const token = jwt.sign(
                                {newUser},
                                //find way to hide key
                                'key',
                                {
                                    expiresIn: '24h'
                                },
                                (err, token) => {
                                    if(err){res.json(err)}
                                    res.status(200).json({
                                        message: 'User Created',
                                        newUser,
                                        token
                                    })
                                }
                            )
                    })
                }
            })
        }
    })
});

app.post('/api/login', (req, res) => {
    db.User.find({username: req.body.username})
        .select('+password')
        .exec()
        .then( users => {
        if(users.length < 1) {
            return res.status(401).json({
                message: "Username/Password incorrect"
            })
        }
        bcrypt.compare(req.body.password, users[0].password, (err, match) => {
            if(err){console.log(err);return res.status(500).json({err})}
            if(match){
                const token = jwt.sign(
                {
                username: users[0].username,
                email: users[0].email,
                _id: users[0]._id
                }, 
                'key',
                {
                    expiresIn: "24h"
                },
            );
            return res.status(200).json(
                {
                message: 'Authenticated',
                token
                }
            )
            } else {
                res.status(401).json({message: "Username/Password incorrect"})
            }
        })

        })
        .catch( err => {
            res.status(500).json({err})
        })
})

app.get('/api/users', (req, res) => {
    db.User.find( {}, (err, usersAll) => {
        if(err){console.log(err)};
        res.json({usersAll});
    });
});

app.get('/api/user/:id', (req, res) => {
    let userId = req.params.id;
    db.User.findById( userId )
        // .populate('username')
        .exec( (err, foundUser) => {
        if(err){ return res.status(400).json({err: "error has occured"})} 
        res.json(foundUser);
    });
});

app.get('/api/artists', (req, res) => {
    db.Artist.find( {}, (err, artistsAll) => {
        if(err){console.log(err)};
        res.json({artistsAll});
    });
});

app.get('/api/songs', (req, res) => {
    db.Song.find( {}, (err, songsAll) => {
        if(err){console.log(err)};
        res.json({songsAll});
    });
});

function verifyToken (req, res, next) {
    console.log("in verify...");
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        console.log(req.token)
        // Next middleware
        next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(process.env.PORT || 3000, () => console.log('Red 5 standing by at http://localhost:3000/'));