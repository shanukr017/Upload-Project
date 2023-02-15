const go = require("./read");

async function read(){
    var data = await go();
    data = await data.find({}).toArray();
    console.log(data[4].name);
}

read();