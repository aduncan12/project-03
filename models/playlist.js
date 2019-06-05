const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const playlistSchema = new Schema({
    title: String,
    song: String,
    // song: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Song'
    // },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;