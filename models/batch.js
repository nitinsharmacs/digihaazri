const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
const file = require('../util/file');
let db;
database((database)=>{
	db = database;
});

class Batch {
	constructor(batchInformation){
		this.batchToSend = {
			batchname: batchInformation.batchname,
			batchpassword: batchInformation.batchpassword,
			teachername: batchInformation.teachername,
			teacherid: batchInformation.teacherid,
			batchimageurl: batchInformation.batchimageurl,
			createdat: batchInformation.createdat,
			totalstudents: 0
		}
	}

	save(username){
		return db.collection(username+'_batch').insertOne(this.batchToSend);
	}

	// method for finding batch by name
	static findBatchByName(username, batchname){
		return db.collection(username+'_batch').findOne({batchname: batchname});
	}

	//method for fetching all batches
	static fetchbatches (username){
		return db.collection(username+'_batch').find().toArray();
	}
	// method for counting batches
	static countBatches(username){
		return db.collection(username+'_batch').countDocuments();
	}

	//method for finding batch by batchid
	static findBatchById(username, batchid){
		return db.collection(username+'_batch').findOne({_id: new mongodb.ObjectId(batchid)});
	}
	//method for updating batch by username, batchid, updatedata and whattoupdate
	static updateBatch(username, batchid, updateData, whattoupdate){
		switch(whattoupdate){
			case 'PASSWORD':
				return db.collection(username+'_batch').updateOne({_id: new mongodb.ObjectId(batchid)}, {$set:{batchpassword: updateData}});
			case 'MULTIPLE':
				return db.collection(username+'_batch').updateOne({_id: batchid}, {$set:{batchname: updateData.batchname, teachername: updateData.teachername, batchimageurl: updateData.batchimageurl}});
			case 'STUDENTS':
				return db.collection(username+'_batch').updateOne({_id: batchid}, {$set:{totalstudents: updateData}});
		}
	}

	static deleteBatchById(username, batchid){
		return db.collection(username+'_batch').findOne({_id: batchid}).then(batch=>{
			if(batch){
				file.deleteFile('/'+batch.batchimageurl);
			}
			return db.collection(username+'_batch').remove({_id: batchid});
		});
	}

}

module.exports = Batch;