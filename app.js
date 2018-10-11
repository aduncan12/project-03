
const express = require('express');
const bodyParser = require('body-parser');

// required for Spotify authentication
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

// Spotify api requirements
const client_id = '74893e3303c047d68148a47c4ef102bd';
const client_secret = '7f5e85cf702849d9894deb45e13678e1'; 
const redirect_uri = 'https://open.spotify.com';

const generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

const app = express();
const db = require('./models')

app.use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());


app.get('/login', (req, res) => {
    let state = generateRandomString(16);
        res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
    }));
});

app.get('/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;
        if (state === null || state !== storedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(stateKey);
            let authOptions = {
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

            request.post(authOptions, (error, response, body) => {
                if (!error && response.statusCode === 200) {

                    let access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    let options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, (error, response, body) => {
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

app.get('/refresh_token', (req, res) => {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
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
                let access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });


app.listen(process.env.PORT || 3000, () => console.log('Lets go at http://localhost:3000/'));