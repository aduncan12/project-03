const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const artistSchema = new Schema({
    name: { type: String },
    image: { type: String },
    popularity: { type: Number },
    genre: { type: String },
    artistUrl: { type: String }
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;