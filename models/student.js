 const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});

//importing util file 
const file = require('../util/file');

class Student {
	constructor(studentinfo){
		this.studentToSend = {
			studentname: studentinfo.studentname,
			studentphone: studentinfo.studentphone,
			studentguardian: studentinfo.studentguardian,
			studentaddtime: studentinfo.studentaddtime,
			studentaddress: studentinfo.studentaddress,
			studentimage: studentinfo.studentimage,
			batches: 1,
		}
	}

	save(username){
		return db.collection(username+'_students').insertOne(this.studentToSend);
	}

	static countStudents(username) {
		return db.collection(username+'_students').countDocuments();
	}

	static fetchStudentsLimit(username, page, ITEM_P_PAGE){
		return db.collection(username+'_students').find().skip(page*ITEM_P_PAGE).limit(ITEM_P_PAGE).toArray();
	}
	static fetchStudents(username){
		return db.collection(username+'_students').find().toArray();
	}

	static deleteStudent(username, id){
		return db.collection(username+'_students').deleteOne({_id: id});
	}
	static findStudentsByIdArray(username, idarray){
		return db.collection(username+'_students').find({_id:{$in:idarray}}).toArray();
	}
	static findStudentById(username, id){
		return db.collection(username+'_students').findOne({_id: new mongodb.ObjectId(id)});
	}
	static updateStudent(username, id, whattoupdate, updatedata){
		switch(whattoupdate){
			case 'ALL': 
				return db.collection(username+'_students').updateOne({_id: new mongodb.ObjectId(id)}, {$set:{studentname: updatedata.studentname, studentphone: updatedata.studentphone, studentguardian: updatedata.studentguardian, studentaddress: updatedata.studentaddress, studentimage: updatedata.studentimage}});
			case 'BATCHES':
				return db.collection(username+'_students').findOne({_id: new mongodb.ObjectId(id)}).then(student=>{
					return db.collection(username+'_students').updateOne({_id: new mongodb.ObjectId(id)}, {$set:{batches: student.batches+1}});
				});
			case 'BATCHESDECRE':
				return db.collection(username+'_students').findOne({_id: new mongodb.ObjectId(id)}).then(student=>{
					return db.collection(username+'_students').updateOne({_id: new mongodb.ObjectId(id)}, {$set:{batches: student.batches-1}});
				});
		}
	}
	static findStudentByAll(username, studentdata){
		
		return db.collection(username+'_students').findOne({studentname: studentdata.studentname, studentphone: studentdata.studentphone, studentaddress: studentdata.studentaddress});
	}
	static deleteStudentByIdArray(username, idarray){
		console.log('id array');
		console.log(idarray);

		return  db.collection(username+'_students').find({_id:{$in:idarray}}).toArray().then(students=>{
				if(!students && !students.length>0){
					return Promise.resolve(undefined);
				}
				console.log('in model');
				console.log(students);
				
				return db.collection(username+'_students').remove({_id:{$in:idarray}}).then(result=>{
						if(!result){
							// students not deleted 
							return Promise.resolve(undefined);
						}
						for(let stud of students){
							file.deleteFile('/'+stud.studentimage);
						}
						return Promise.resolve(true);
				});
		});
	}
}

module.exports = Student;