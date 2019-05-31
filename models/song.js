const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const songSchema = new Schema({
    trackId: String,
    artist: String,
    song: String,
    album: String,
    popularity: Number,
    trackUrl: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    playlists: {
        type: Schema.Types.ObjectId,
        ref: 'Playlists'
    }
})

const Song = mongoose.model('Song', songSchema);

module.exports = Song;