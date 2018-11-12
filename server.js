const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const db = require('./models')
const cors = require('cors')
const request = require('request')
const querystring = require('querystring')
const cookieParser = require ('cookie-parser')
// const config = require('./config/config')
// const passport = require('./config/passport')

// const key = process.env.SECRET_KEY


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(cors())


const client_id = '74893e3303c047d68148a47c4ef102bd';
const client_secret = '1ae987f680774d60873d887e8e878083'; 
const redirect_uri = 'http://localhost:8888/callback'


//html endpoints
//STILL NEED TO RESTRICT ACCESS WITH VERIFYTOKEN
app.get('/', (req, res) => 
    res.sendFile(__dirname + '/views/index.html'));

    
app.get('/main', (req, res, next) => {
    console.log('token: ' +req.token)
    res.sendFile(__dirname + '/views/main.html')
    });

app.get('/profile', (req, res) => 
    res.sendFile(__dirname + '/views/profile.html'));

app.get('/about', (req, res) => 
    res.sendFile(__dirname + '/views/about.html'));

app.post('/verify', verifyToken, (req, res) => {
    console.log('req.token: ' + req.token)
    let verified= jwt.verify(req.token, 'key')
    console.log("verified: ", verified)
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
            {method: "GET", path: "/api/user/:id", description: "View user by id"}, 
            {method: "GET", path: "/api/artist/:id", description: "View artist by name"},
            {method: "GET", path: "/api/song/:id", description: "View song by name"}, 
            {method: "GET", path: "/api/comments", description: "View all comments"},
            {method: "GET", path: "/api/spotify", description: "Get spotify users"},
            {method: "POST", path: "/api/signup", description: "Sign up users"},
            {method: "POST", path: "/api/login", description: "User log in"},
            {method: "POST", path: "/api/addartist", description: "Add Artist Info"},
            {method: "POST", path: "/api/addsong", description: "Add Song Info"},
            {method: "DELETE", path: "/api/artists", description: "Remove artist from database"}
        ]
    })
});


function verifyToken (req, res, next) {
    console.log("in verify...");
    const bearerHeader = req.headers.authorization;
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        // console.log('Bearer ' + bearer)
        // Get token from array
        const bearerToken = bearer[1];
        // console.log('Bearer Token ' + bearerToken)
        // Set the token
        req.token = bearerToken;
        console.log('req.token ' + req.token)
        // Next middleware
        next();

    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.post('/api/signup', (req, res) => {
    db.User.find({username: req.body.username})
    .select('+password')
    .exec()
    .then( user => {
        if (user.length >= 1) {
            return res.status(401).json({
                message: "user already exists!"
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
                            console.log(token)
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

app.post('/api/addartist', (req, res) => {
    let artistAdded = req.body
// find way to save genres array
    db.Artist.find({artistId: artistAdded.artistId})
        .exec()
        .then( artists => {
            if(artists.length >= 1) {
                return res.status(409).json({
                    message: "artist already exists"
                })
            } else {
                db.Artist.create({
                    artistId: artistAdded.artistId,
                    name: artistAdded.name,
                    image: artistAdded.image,
                    popularity: artistAdded.popularity,
                    genres: artistAdded.genres,
                    artistUrl: artistAdded.artistUrl,
                    user: artistAdded.userId,        
                    }, 
                    (err, savedArtist) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(savedArtist);
                            return res.json({data: savedArtist})
                        }
                    })
                }
        })
})

// app.delete('/api/artist', (req, res) => {
//     let id = req.body._id
//     let artist = req.body.name
//     let user = req.body.user
//     console.log(id)
//     db.Artist.deleteOne()
// })

app.post('/api/addsong', (req, res) => {
    let trackAdded = req.body
    // console.log(trackAdded)

    db.Song.find({trackId: trackAdded.trackId})
    .exec()
    .then( songs => {
        if(songs.length >= 1) {
            return res.status(409).json({
                message: "song already exists"
            })
        } else {
            db.Song.create({
                trackId: trackAdded.trackId,
                artist: trackAdded.artist,
                song: trackAdded.song,
                album: trackAdded.album,
                popularity: trackAdded.popularity,
                trackUrl: trackAdded.trackUrl,
                user: trackAdded.userId,        
                }, 
                (err, savedTrack) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(savedTrack);
                        return res.json({data: savedTrack})
                    }
                })
            }            
    })
})

app.get('/api/users', (req, res) => {
    db.User.find( {}, (err, usersAll) => {
        if(err){console.log(err)};
        res.json({usersAll});
    });
});

app.get('/api/user/:id', (req, res) => {
    let userId = req.params._id;
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

app.get('/api/artist/:id', (req, res) => {
    let id = req.params.id;
    console.log(id)
    db.Artist.findById( {_id: id} )
        // .populate('username')
        .then( foundArtist => {
        res.json(foundArtist);
    });
});

app.get('/api/songs', (req, res) => {
    db.Song.find( {}, (err, songsAll) => {
        if(err){console.log(err)};
        res.json({songsAll});
    });
});

app.get('/api/song/:id', (req, res) => {
    let id = req.params.id;
    console.log(id)
    db.Song.findById( {_id: id} )
        // .populate('username')
        .then( foundSong => {
        res.json(foundSong);
    });
});


// Spotify auth token
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';
    
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', function(req, res) {

var state = generateRandomString(16);
res.cookie(stateKey, state);

// your application requests authorization
var scope = 'user-read-private user-read-email';
res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
    }));
    console.log('state:' + state)
    console.log('client id:' + client_id)
});

app.get('/callback', function(req, res) {

// your application requests refresh and access tokens
// after checking the state parameter

var code = req.query.code || null;
var state = req.query.state || null;
var storedState = req.cookies ? req.cookies[stateKey] : null;

if (state === null || state !== storedState) {
    res.redirect('/#' +
    querystring.stringify({
        error: 'state_mismatch'
    }));
} else {
    res.clearCookie(stateKey);
    var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    },
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
    };


    request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
        console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
        querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        }));
    } else {
        res.redirect('/#' +
        querystring.stringify({
            error: 'invalid_token'
        }));
    }
    });
}
});

app.get('/refresh_token', function(req, res) {

// requesting access token from refresh token
var refresh_token = req.query.refresh_token;
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
    grant_type: 'refresh_token',
    refresh_token: refresh_token
    },
    json: true
};

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
    var access_token = body.access_token;
    res.send({
        'access_token': access_token
    });
    }
});
});


app.listen(process.env.PORT || 8888, () => console.log('Red 5 standing by at http://localhost:8888/'));