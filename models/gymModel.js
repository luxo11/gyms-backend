const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gymSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    openingHours: {
        type: [String],
        required: true
    },
    categories: {
        type: [String],
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    facebook: {
        type: String,
        required: false
    },
    imageName: {
        type: String,
        required: true
    },
    originalImageName: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Gym', gymSchema)