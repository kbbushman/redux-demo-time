const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    rating: {type: Number, required: true, default: 5},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
})

module.exports = mongoose.model('Review', reviewSchema)