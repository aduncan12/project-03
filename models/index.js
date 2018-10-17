const mongoose = require('mongoose');
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/project03', { useNewUrlParser: true } );

const User = require('./user');
const Artist = require('./artist');
const Song = require('./song');
const Comments = require('./comments');

module.exports = {
    User: User,
    Artist: Artist,
    Song: Song,
    Comments: Comments
}
