const mongoose = require('mongoose')

const Schema = mongoose.Schema

const citySchema = new Schema({
    name: {
        type: String
    },
    district: {
        type: String
    },
    region: {
        type: String
    }
})

module.exports = mongoose.model('City', citySchema)