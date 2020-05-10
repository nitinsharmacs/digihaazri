const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});

class BatchRegister {
	constructor(attendenceinfo){
		this.attendenceinfoToSend = {
			date: attendenceinfo.date,
			time: attendenceinfo.time, 
			studentpresent: attendenceinfo.studentpresent,
			present: attendenceinfo.present,
			emailsent: attendenceinfo.emailsent
		}
	}
	save(username, batchname){
		return db.collection(username+'_'+batchname+'_reg').insertOne(this.attendenceinfoToSend);
	}
	static fetchattendence(username, batchname, skipnumber, limitnumber){
		return db.collection(username+'_'+batchname+'_reg').find().skip(skipnumber).limit(limitnumber).toArray();
	}

	static countAttendence(username, batchname){
		return db.collection(username+'_'+batchname+'_reg').countDocuments();
	}
	static deleteHistoryByIds(username, batchname, ids){
		return db.collection(username+'_'+batchname+'_reg').remove({_id: {$in:ids}});
	}
	static findAttendenceById(username, batchname, id){
		return db.collection(username+'_'+batchname+'_reg').findOne({_id: new mongodb.ObjectId(id)});
	}
	static fetchAllAttendence(username, batchname){
		return db.collection(username+'_'+batchname+'_reg').find().toArray();
	}
	static removeAttendenceReg(username, batchname){
		return db.collection(username+'_'+batchname+'_reg').find().toArray().then(result=>{
			console.log(result);
			if(result && result.length<=0){
				return Promise.resolve({result: true});
			}
			return db.collection(username+'_'+batchname+'_reg').drop();
		});
		
	}
}

module.exports = BatchRegister;