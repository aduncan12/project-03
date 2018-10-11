
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const db = require('./models')


app.use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(__dirname + '/public'))

const user = {
    email: 'mail@mail.com',
    password: 'password',
    username: 'testuser',
    image: './public/images/alan.JPG'
};

const artist = {
    artist: 'Plainclothesman',
    image: './public/images/farallones.jpg',
    popularity: 4,
    genre: 'Space Rock',
    artistUrl: 'https://theplainclothesman.bandcamp.com/'
};

const song = {
    artist: 'Plainclothesman',
    song: 'The Cycle',
    album: 'Music City',
}

const comments = {
    username: 'testuser',
    artist: 'Plainclothesman',
    content: 'The voice of a generation'
}

app.get('/', (req, res) => 
    res.sendFile(__dirname + '/views/index.html'));
app.get('/login', (req, res) =>
    res.sendFile(__dirname + '/views/index.html'));
app.get('/user', (req, res) => res.json(user));
app.get('/artist', (req, res) => res.json(artist));
app.get('/song', (req, res) => res.json(song));
app.get('/comments', (req, res) => res.json(comments));


app.listen(process.env.PORT || 3000, () => console.log('Red 5 standing by at http://localhost:3000/'));