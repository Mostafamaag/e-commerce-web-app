const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://admin:password_123@learn-mangodb2.w6l2jav.mongodb.net/'
//const MongodbClient = new mongodb(url);

const client = new MongoClient(url);

let db;
mongoConnect = (cb) => {

    client.connect()
        .then(client => {
            console.log("Connected");
            db = client.db('mongoDatabase');
            cb();
        })
        .catch(err => {
            console.log("Error :", err);
            throw err
        });
}

const getDb = () => {
    //console.log("ddddddddd", db);
    if (db) return db;
    throw 'No database found';
}

module.exports = {
    mongoConnect,
    getDb,
}
