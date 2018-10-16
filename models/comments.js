const mongoose = require('mongoose'),
    Schema = mongoose.Schema;



const commentsSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },   
    artist: { 
        type: Schema.Types.ObjectId,
        ref: 'Artist', 
        required: true
    },
    content: {
        type: String
    },
    date: Date
})

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;