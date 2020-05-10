const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});

class Register {
	constructor(registerInfo){
		this.registerToSend = {
			batchId: registerInfo.batchId,
			batchname: registerInfo.batchname,
			studentId: []
		}
	}

	save(username){
		return db.collection(username+'_registers').insertOne(this.registerToSend);
	}


	static updateData(username, key ,updateContent, whatToUpdate){
		let roll = 0;
		switch(whatToUpdate){
			case 'STUDENTID' : 
				return db.collection(username+'_registers').findOne({batchId: key}).then(result=>{
					// console.log([...result.studentId, updateContent]);
						let previousstudent = result.studentId[result.studentId.length-1];
						if(previousstudent){
							roll = previousstudent.rollno;
						}
						++roll;
						return db.collection(username+'_registers').updateOne({batchId: key}, {$set:{studentId: [...result.studentId, {id:updateContent, rollno: roll}]}});
					
				});
			 case 'STUDENTIDS':
			 	return db.collection(username+'_registers').updateOne({batchId: key}, {$set:{studentId: updateContent}});
		}
	}

	static findRegisterByBatchid(username, batchid){
		return db.collection(username+'_registers').findOne({batchId: batchid});
	}

	static deleteReigsterByBatchId(username, batchid){
		return db.collection(username+'_registers').remove({batchId: batchid});
	}

}

module.exports = Register;