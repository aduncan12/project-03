const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const artistSchema = new Schema({
    artistId: String,
    name: String,
    image: String,
    popularity: Number,
    genres: Array,
    artistUrl: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;