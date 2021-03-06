const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },   
    email: { 
        type: String, 
        required: true, 
        unique: false, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    },
    password: {
        type: String,
        required: true,
        unique: false
    },

    // image: String,
    
    songs: {
        type: Schema.Types.ObjectId,
        ref: 'Songs'
    },
    playlists: {
        type: Schema.Types.ObjectId,
        ref: 'Playlists'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;