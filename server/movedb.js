const MongoClient = require('mongodb').MongoClient;
const { dbUrl } = require('./config.js');

async function mongo(){
    const client = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
    console.log("Connected successfully to mongodb server");
    const col = client.db("auction").collection('vins');
    const vin = (await col.findOne({})).result;
    await col.replaceOne({}, vin);
}

mongo();