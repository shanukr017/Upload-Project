const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/demodb");

const schema = mongoose.Schema({
    keyNumber : String,
    fileName : String,
    filePassword : String,
    originalFileName : String
})

module.exports =  mongoose.model("file",schema);