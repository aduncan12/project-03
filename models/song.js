const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const songSchema = new Schema({
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    song: { 
        type: String
    },
    album: {
        type: String
    }
})

const Song = mongoose.model('Song', songSchema);

module.exports = Song;