const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const db = require('./models')
const cors = require('cors')
const request = require('request')
const querystring = require('querystring')
const config = require('./config/config')
const passport = require('./config/passport')

// const key = process.env.SECRET_KEY


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(cors())


let redirect_uri = process.env.REDIRECT_URI || 'https://pyrrha.herokuapp.com/'

app.get('/spotify', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: 'user-read-private user-read-email',
            redirect_uri
        }))
})

app.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
        },
        headers: {
        'Authorization': 'Basic ' + (new Buffer(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'))
        },
        json: true
    }
    request.post(authOptions, function(error, response, body) {
        let access_token = body.access_token
        let uri = process.env.FRONTEND_URI || 'https://pyrrha.herokuapp.com/main'
        res.redirect(uri + '?access_token=' + access_token)
    })
})

app.listen(process.env.PORT || 8888, () => console.log('Red 5 standing by at http://localhost:8888/'));