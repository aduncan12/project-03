const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    Comments = require('./comments')


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
    image: {
        type: String
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;