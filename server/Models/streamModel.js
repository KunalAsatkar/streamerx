const mongoose = require('mongoose');

const streamSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    key: {
        type: String,
        required: [true, "key is required"]
    },
    location: {
        type: String,
        required: [true, "location is required"]
    }
}, {
    timestamps: true
});

const streamModel = mongoose.model('stream', streamSchema);

module.exports = { streamModel };