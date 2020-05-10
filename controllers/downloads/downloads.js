const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');

// importing batch register model
const BatchRegister = require('../../models/batchregister');
// importing register model
const Register = require('../../models/registers');
// importing student model
const Student = require('../../models/student');


//importing 3rd party packages
const pdfDocument = require('pdfkit');

const attendencehistory = (req, res, next) => {
	const attendId = req.params.id;
	let attendenceresult;
	let batchstudents;
	let absentStudents = [];
	let presentStudents;
	let emailsent = [];
	// first fetching attendence
	BatchRegister.findAttendenceById(req.session.userInfo.username, req.session.batchInfo.batchname, attendId).then(result=>{
		if(!result){
			const error = new Error('Attendence not fetched !');
			error.type = 'WEB';
			error.statusCode = 404;
			throw error;
		}
		attendenceresult = result;
		// console.log(attendenceresult);
		return Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId);
	}).then(result=>{
		if(!result){
			const error = new Error('Attendence not fetched !');
			error.type = 'WEB';
			error.statusCode = 404;
			throw error;
		}
		batchstudents = result.studentId;
		// console.log(batchstudents)
		const objectids = batchstudents.map(stu=>new mongodb.ObjectId(stu.id));
		return Student.findStudentsByIdArray(req.session.userInfo.username, objectids);
	}).then(result=>{
		const allstudents = result.map(stud=>{
			let data = batchstudents.find(student=>student.id.toString() == stud._id.toString());
			data = {...data, studentname: stud.studentname};
			return data;
		});
		batchstudents = [...allstudents];
		presentStudents = batchstudents.filter(student=>{
			if(attendenceresult.studentpresent.includes(student.id)){
				return student;
			} else {
				absentStudents.push(student);
			}
		});
		emailsent = absentStudents.filter(student=>{
			if(attendenceresult.emailsent.includes(student.id)){
				return student;
			}
		})
		// console.log(presentStudents);
		// console.log(absentStudents);
		// console.log(emailsent);
		const filename = attendenceresult._id.toString() + '.pdf';
		const filepath = path.join(__dirname, '../../','data', filename);
		 res.setHeader('Content-Type', 'application/pdf');
		 res.setHeader('Content-disposition', 'attachment; filename= "' + filename + ' " ');
			const pdfdoc = new pdfDocument();
			pdfdoc.pipe(fs.createWriteStream(filepath));
			pdfdoc.pipe(res);
			pdfdoc.fontSize(25).fillColor('blue').text(req.session.batchInfo.batchname+' Attendence History', { align:'center' });
			pdfdoc.moveDown();
			pdfdoc.fontSize(15).fillColor('black').text(attendenceresult.date+' , ' + attendenceresult.time, {align:'left'});
			pdfdoc.moveDown();
			pdfdoc.text('Total Student In Batch : '+ batchstudents.length)
			pdfdoc.text('Present Students : ' + presentStudents.length);
			pdfdoc.text('Absent Students : ' + absentStudents.length);
			pdfdoc.moveDown();
			pdfdoc.fontSize(18).fillColor('blue').text('Present students : )');
			pdfdoc.moveDown();
			for(student of presentStudents){
				pdfdoc.fontSize(15).fillColor('black').text('Roll Number : '+student.rollno+' , '+'Name : '+student.studentname);
			}
			pdfdoc.moveDown();
			pdfdoc.fontSize(18).fillColor('blue').text('Absent students : (').moveDown();
			for(student of absentStudents){
				pdfdoc.fontSize(15).fillColor('black').text('Roll Number : '+student.rollno+' , '+'Name : '+student.studentname);
			}
			pdfdoc.moveDown();
			pdfdoc.fontSize(18).fillColor('blue').text('Email sent to : ');
			pdfdoc.moveDown();
			if(!emailsent.length>0){
				pdfdoc.fontSize(15).fillColor('black').text('No Email Were sent !');
			} else {
				for(email of emailsent){
					pdfdoc.fontSize(15).fillColor('black').text('Roll Number : '+email.rollno+' , '+'Name : '+email.studentname);
				}
			}
			
			pdfdoc.end();
			
	})
};

module.exports = {
	attendencehistory:attendencehistory
}