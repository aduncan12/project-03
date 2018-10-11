const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/3000', { useNewUrlParser: true } );

const User = require('./user');
const Artist = require('./artist');
const Song = require('./song');
const Comments = require('./comments');

exports.User = User;
exports.Artist = Artist;
exports.Song = Song;
exports.Comments = Comments;