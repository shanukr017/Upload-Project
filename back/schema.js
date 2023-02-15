const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/demodb");

const schema = mongoose.Schema({
    keyNumber : String,
    fileName : String
})

module.exports =  mongoose.model("fileData",schema);