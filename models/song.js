const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const songSchema = new Schema({
    trackId: String,
    artist: String,
    // artist: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Artist'
    // },
    song: String,
    album: String,
    popularity: Number,
    trackUrl: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Song = mongoose.model('Song', songSchema);

module.exports = Song;