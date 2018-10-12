const db = require('./models')

const user = {
    email: 'mail@mail.com',
    password: 'password',
    username: 'testuser',
    image: './public/images/alan.JPG'
};

const artist = {
    id: 2,
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
