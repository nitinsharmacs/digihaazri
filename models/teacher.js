const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});

class Teacher{
	constructor(teacherInfo){
		this.teacherToSend = {
			teachername: teacherInfo.teachername,
			teacherimageurl:teacherInfo.imageinfo || '',
			teacherphone: teacherInfo.teacherphone || null,
			teacheremail:teacherInfo.teacheremail || '',
			teacheraddress:teacherInfo.teacheraddress || '',
			teacherid: teacherInfo.teacherid,
			addedat: teacherInfo.addedat
		}
	}
	save(username){
		return db.collection(username+'_teacherprofile').findOne({teachername: this.teacherToSend.teachername, teacherphone: this.teacherToSend.teacherphone, teacheremail: this.teacherToSend.teacheremail, teacheraddress: this.teacherToSend.teacheraddress}).then(result=>{
			if(result){
				//if teacher is present
				return new Promise((resolve, reject)=>{
				resolve(undefined);
				});
			} else {
				//teacher is not present
				return db.collection(username+'_teacherprofile').insertOne(this.teacherToSend);
			
			}
		});
	}

	// fetching particular teacher
	static fetchTeacher(username, teacherid){
		return db.collection(username+'_teacherprofile').findOne({_id: new mongodb.ObjectId(teacherid)});
	}

	static fetchTeachers(username){
		return db.collection(username+'_teacherprofile').find().toArray();
	}
	static countTeachers(username){
		return db.collection(username+'_teacherprofile').countDocuments();
	}
	
	static findTeacher(username, teachername ,teacherid){
		return db.collection(username+'_teacherprofile').findOne({teachername:teachername, teacherid: teacherid});
	}

	static updateTeacher(username, teacherid, updateData, whattoupdate){
		switch(whattoupdate){
			case 'PROFILEIMAGE':
				return db.collection(username+'_teacherprofile').updateOne({_id: new mongodb.ObjectId(teacherid)}, {$set:{teacherimageurl: updateData}});
			default: 
				return new Promise((resolve, reject)=>{
					return resolve(undefined);
				});
			case 'REST' : 
				return db.collection(username+'_teacherprofile').updateOne({_id: new mongodb.ObjectId(teacherid)}, {$set:{teachername: updateData.teachername, teacherphone: updateData.teacherphone, teacheremail: updateData.teacheremail, teacheraddress: updateData.teacheraddress}});
			case 'TEACHERNAME' : 
				return db.collection(username+'_teacherprofile').updateOne({_id: teacherid}, {$set:{teachername: updateData}});
		}
	}
}


module.exports = Teacher;