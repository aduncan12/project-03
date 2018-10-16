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
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 
    },
    password: {
        type: String,
        required: true,
        unique: true
    },

    image: String,
    
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;