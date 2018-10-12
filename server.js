
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const db = require('./models')


app.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(express.static(__dirname + '/public'))

//html endpoints
app.get('/', (req, res) => 
    res.sendFile(__dirname + '/views/index.html'));
app.get('/login', (req, res) =>
    res.sendFile(__dirname + '/views/index.html'));
app.get('/user', (req, res) => res.json(user));

//api endpoints
app.get('/artist', (req, res) => res.json(artist));
app.get('/song', (req, res) => res.json(song));
app.get('/comments', (req, res) => res.json(comments));


app.listen(process.env.PORT || 3000, () => console.log('Red 5 standing by at http://localhost:3000/'));