const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    message: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    gymId: {
        required: true,
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)