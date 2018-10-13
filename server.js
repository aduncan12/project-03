const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const db = require('./models')
const config = require('./config/config')
const passport = require('./config/passport')

const key = process.env.SECRET_KEY


app.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(express.static(__dirname + '/public'))

//html endpoints
app.get('/', (req, res) => 
    res.sendFile(__dirname + '/views/index.html'));
app.get('/login', (req, res) =>
    res.sendFile(__dirname + '/views/login.html'));
app.get('/user', (req, res) => res.json(user));

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
        ]
    })
});

app.post('/signup', (req, res) => {
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
                console.log(req.body.password)
                if(err){ 
                    res.status(500).json({error: err})
                } else {
                    const userToCreate = new db.User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                    });
                    db.User.create(userToCreate, (err, users) => {
                        if(err){console.log(err);}
                            const token = jwt.sign(
                                {users},
                                //find way to hide key
                                'key',
                                {
                                    expiresIn: '5h'
                                },
                                (err, token) => {
                                    if(err){res.json(err)}
                                    res.status(200).json({
                                        message: 'User Created',
                                        users,
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

app.post('/login', (req, res) => {
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
                "key",
                {
                    expiresIn: "5h"
                },
            );
            return res.status(200).json(
                {
                message: 'Auth successful',
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

app.listen(process.env.PORT || 3000, () => console.log('Red 5 standing by at http://localhost:3000/'));