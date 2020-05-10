const mongodb  = require('mongodb');	//importing mongodb
const MongoClient = mongodb.MongoClient;		//making a MongoClient variable
const URL1 = 'mongodb://127.0.0.1:27017';
const URL = process.env.DB_URL || 'mongodb+srv://nitin:nitin123@cluster0-jx9oe.mongodb.net?retryWrites=true&w=majority';
const DB_NAME = process.env.DB_NAME || 'expressJs';
const dbconnection = cb => {
	MongoClient.connect(URL, {useNewUrlParser: true}).then(client=>{
		cb();
	}).catch(err=>{
		console.log(err);
		cb();
	})
}

const database = (callback) =>{
	MongoClient.connect(URL, {useNewUrlParser: true}).then(client=>{
			return callback(client.db(DB_NAME));
	}).catch(err=>{
		console.log(err);
		throw 'DATABASE NOT FOUND';
	})
}

exports.dbconnection = dbconnection;
exports.database = database;