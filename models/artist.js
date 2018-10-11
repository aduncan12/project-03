const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const artistSchema = new Schema({
    id: { type: Number },
    artist: { type: String },
    image: { type: String },
    popularity: { type: Number },
    genre: { type: String },
    artistUrl: { type: String }
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;