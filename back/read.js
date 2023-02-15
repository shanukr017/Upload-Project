const {MongoClient} = require('mongodb')

const url = "mongodb://localhost:27017";

const dbName = "e-comm";

const client = new MongoClient(url);

async function read(){
    const conn = await client.connect();
    const dbConn = conn.db(dbName);
    return dbConn.collection('products');
}   

module.exports = read;