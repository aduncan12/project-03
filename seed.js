const db = require('./models')

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
    URL: 'https://theplainclothesman.bandcamp.com/'
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
};

app.get('/', (req, res) => res.send('This is where the music is found'));
app.get('/user', (req, res) => res.json(user));
app.get('/artist', (req, res) => res.json(artist));
app.get('/song', (req, res) => res.json(song));
app.get('/comments', (req, res) => res.json(comments));