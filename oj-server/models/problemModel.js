const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    "id": Number,
    "name": String,
    "desc": String,
    "difficulty": String
});

const problemModel = mongoose.model('problem', problemSchema);

module.exports = problemModel;