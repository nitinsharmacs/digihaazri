const mongodb = require('mongodb');

const ITEMS_PER_PAGE 	= 5;

//importing 3rd party packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator/check');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// creating transporter for sending mails
// const transporter = nodemailer.createTransport({
// 	host: 'smtp.sendgrid.net',
// 	port: 25,
// 	secure: false,
// 	auth: {
// 		user: 'apikey',
// 		pass: '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'
// 	}
// });

// importing mail util method
const sendMail = require('../../util/sendMail');

// importing util method for sending SMSs
const sendMessage = require('../../util/smsConnection');
//--------- now we can use transporter to send mails

//importing util file 
const file = require('../../util/file');
const currentdatetime = require('../../util/currentdatetime');
const {makeError, updateBatchRecord} = require('../../util/util');
//importing batch model
const Batch = require('../../models/batch');

//importing teacher model
const Teacher = require('../../models/teacher');

//importing student model 
const Student = require('../../models/student');

// importing Register model
const Register = require('../../models/registers');

// importing BatchRegiser model
const BatchRegiser = require('../../models/batchregister');

// importing User model
const User = require('../../models/users');

//method for changing the profilepicture of the teacher/user
const changeimage = (req, res, next)=>{
	// console.log(req.files.profileimageinput[0]);		//req.file will become req.files when mulitple fieldnames are provided to multer. We archive the particular file object information by that input name as profileimageinput. req.files.profileimageinput is an array. so we can access the object using profileimageinput[0]
	if(req.files.profileimageinput[0]){
		//if image file is valid

		// first deleting the previous uploaded image
		Teacher.fetchTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId).then(teacher=>{
			if(teacher){
				file.deleteFile(teacher.teacherimageurl);	//deleting image
				const imagepath = req.files.profileimageinput[0].path;
				Teacher.updateTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId, imagepath, 'PROFILEIMAGE').then(result=>{
						console.log(result);
						return res.redirect('/admin/particularbatch');
				}).catch(err=>console.log(err));
			}
		}).catch(err=>console.log(err));
		
	} else {
		return res.redirect('/admin/particularbatch');
	}
}

//method for updating teacher profile
const updateprofile = (req, res, next)=>{

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		req.flash('particularbatcherror', error[0]);
		return res.redirect('/admin/particularbatch');
	}

	const updateData = {
		teachername: req.body.teachername,
		teacherphone:req.body.userphone,
		teacheremail:req.body.useremail,
		teacheraddress:req.body.user_address
	};
	
	Teacher.updateTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId, updateData, 'REST').then(result=>{
		if(result){
		res.redirect('/admin/particularbatch');
		} else {
			res.redirect('/admin/particularbatch');
		}
	}).catch(err=>console.log(err));
}

//method for updating teacher password
const updatepassword = (req, res, next) =>{

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		req.flash('particularbatcherror', error[0]);
		return res.redirect('/admin/particularbatch');
	}

	const oldpassword = req.body.oldpassword;

	Batch.findBatchByName(req.session.userInfo.username, req.session.batchInfo.batchname).then(batch=>{
		if(!batch){
			throw new Error('Internal Server Error! Try again...');
		}
		return bcrypt.compare(oldpassword, batch.batchpassword);
	}).then(passwordMatch=>{
		if(!passwordMatch){
			throw new Error('Invalid old password !');
		}
		if(req.body.newpassword !== req.body.confirmpassword){
			throw new Error('Password Not match!');
		}
		const passcode = bcrypt.hashSync(req.body.newpassword, 10);
		return Batch.updateBatch(req.session.userInfo.username, req.session.batchInfo.batchId, passcode, 'PASSWORD');
	}).then(result=>{
		if(!result){
			throw new Error('Password not updated! Try later ...');
		}
		req.flash('particularbatcherror', 'Password Updated !');
		return res.redirect('/admin/particularbatch');
	}).catch(err=>{
		req.flash('particularbatcherror', err.message);
		return res.redirect('/admin/particularbatch');
	});

};

// method for adding student
const addstudent = (req, res, next) =>{
	console.log(req.body);
	// console.log(req.invalidimage);
	const errors = validationResult(req);
	let imagepath = 'images/usericon.png';
	if(req.invalidimage){
		return next(makeError('Invalid image type! :(', 422));
	}
	
	// console.log(req.files.studentimage)
	if(req.files.studentimage){
		// there is image uploaded
		imagepath = req.files.studentimage[0].path;
	}

	if(!errors.isEmpty()){
		// errors are present
		console.log(errors.array()[0].msg);
		if(req.files.studentimage){
			file.deleteFile('/'+imagepath);
		}
		return next(makeError(errors.array()[0].msg, 422));
	}	
	const studentinfo = {
		studentname: req.body.studentname.toLowerCase(),
		studentphone: req.body.studentphone,
		studentguardian: req.body.studentguardian,
		studentaddtime: currentdatetime.currentdate(),
		studentaddress: req.body.studentaddress.toUpperCase(),
		studentimage: imagepath
	}
	
	let insertedStudent;
	let idtocheck;
	let idtosave;
	console.log('STUDENT TO CHECK ') 
	console.log(studentinfo);
	// checking first that student exists or not
	Student.findStudentByAll(req.session.userInfo.username, studentinfo).then(result=>{
	console.log('result 0');
	console.log(result);

		if(result){
			// student found in main database
			idtocheck = result._id;
			insertedStudent = result;
			return Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId);			
		}

		// student not present in main database
		return Promise.resolve({result: true, message: 'save to main database and result id to batch register'});		
	}).then(result=>{
		if(!result){
			throw new Error('Batch Not Found !');
		}
		console.log('result 1')
		console.log(result);
		if(result.result){
			// student not present in main database to saving it to main database
			const student = new Student(studentinfo);
			return student.save(req.session.userInfo.username);
		}
		// student found in main database and now checking student in batch
		if(!result.studentId.length>0){
			// no student present in batch
			return Promise.resolve({result:true, message: 'add studentid to batch regsiter'});
		}
		const studentids = result.studentId;	// storing array of students in batch to variable
		console.log('DATA TO CHECK');
		console.log(idtocheck);
		console.log(studentids);
		const ispresent = studentids.find(data=>data.id.toString() == idtocheck.toString());
		if(ispresent){
			// student also present in batch
			if(req.files.studentimage){
					// there is image uploaded
					file.deleteFile('/'+imagepath);
				}
			throw makeError('Student is present! :(', 422);
		}
		// student not present in batch but present in main database
		return  Promise.resolve({result:true, message: 'add studentid to batch regsiter'});
	}).then(result=>{
		console.log(result);
		idtosave;
		let studenttosave = insertedStudent;
		
		if(!result){
			const error = new Error('Student not Inserted !');
			error.delete = true;
			throw error;
		}

		// student is not present in main db not in batch
		if(result.ops){
			insertedStudent = result.ops[0];	// saving inserted student information
			idtosave = result.ops[0]._id.toString();
		}
		
			if(!result.ops && !result.result)	{
				// this is the case when student is not inserted in main db as well as batch

				const error = new Error('Student not inserted !');
				error.statusCode = 500;
				error.delete = true;
				throw error;
			
			}
		
			if(result.result){

				insertedStudent = studenttosave;
				

				if(idtocheck){
					if(req.files.studentimage){
						// there is image uploaded
						file.deleteFile('/'+imagepath);
				}
			 idtosave = idtocheck.toString(); // idtocheck would have value if student present in main db
			return Student.updateStudent(req.session.userInfo.username, idtosave, 'BATCHES', '');

				}
				

				// situtation where student is present in main db and incrementing the batches field of student
			}
		console.log('IDTOSAVE IS' + idtosave);

		return Promise.resolve(true);

		// adding studentid into the register of the batch
	}).then(result=>{
			if(!result){
				throw makeError('Student batches not updated! :(');
			}
			console.log(result + 'INSERTED STUDENT ID INTO registers');
			return Register.updateData(req.session.userInfo.username, req.session.batchInfo.batchId, idtosave, 'STUDENTID');

		
	}).then(result=>{
				if(!result){
				throw makeError('Student not inserted in batch! :(');
			}
			// method to update batch record
			updateBatchRecord(req, {batchname:req.session.batchInfo.batchname, batchid:req.session.batchInfo.batchId}, {sourcename:'registers', sourceid:'sdfsd'}, 'students').then(result=>console.log(result)).catch(err=>console.log(err));
			return res.status(201).json({
			message: 'Student inserted',
			student: insertedStudent				// getting student information here 
		});
	}).catch(err=>{
		if(err.delete){
			const id = new mongodb.ObjectId(idtosave);
			Student.deleteStudent(req.session.userInfo.username, id);
		}
		next(err);
	})	
};

// controller for edit batch
const editbatch = (req, res, next) =>{
	const errors = validationResult(req);
	let imagepath;
	if(!errors.isEmpty()){
		// errors are present
		const error = errors.array()[0].msg;
		req.flash('particularbatcherror', error);
		return res.redirect('/admin/particularbatch');
	}

	const batchname = req.body.batchname.toLowerCase();
	const teachername = req.body.teachername.toLowerCase();
	Batch.findBatchByName(req.session.userInfo.username, batchname).then(batch=>{
		if(batch){
			// batch is present
			if(batchname != req.session.batchInfo.batchname){
				throw new Error('Choose different Batch name !');
			}
		}
		return Batch.findBatchById(req.session.userInfo.username, req.session.batchInfo.batchId);
	}).then(batch=>{
		if(!batch){
			throw new Error('Error while fetching Batch !');
		}
		imagepath = batch.batchimageurl;
		if(req.files.uploadimage){
			file.deleteFile('/'+imagepath);
			imagepath = req.files.uploadimage[0].path;
		}
		
		const updateData = {
			batchname: batchname, 
			teachername: teachername,
			batchimageurl: imagepath
		}
		return Batch.updateBatch(req.session.userInfo.username, req.session.batchInfo.batchId, updateData, 'MULTIPLE');
	}).then(updatebatchresult=>{
		if(!updatebatchresult){
			throw new Error('Error while batch table updation !!!!!');
		}
		return Teacher.updateTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId, teachername, 'TEACHERNAME');
	}).then(updateteacherresult=>{

		if(!updateteacherresult){
			throw new Error('Error while updating teacher table !!!!');
		}
		return User.updatebatch(req.session.userInfo._id, req.session.batchInfo.batchname, {batchname: batchname, teachername:teachername});

		
	}).then(result=>{
		if(!result){
			throw new Error('Error while updating User batches !');
		}

		req.session.batchInfo.batchname = batchname;
		req.session.save(err=>{
			if(err){
				console.log(err);
				throw err;
			}
			res.redirect('/admin/particularbatch');
		});

	}).catch(err=>{
		console.log(err);
		if(!err.statusCode){
			err.statusCode = 500;
		}
		req.flash('particularbatcherror', err.message);
		return res.redirect('/admin/particularbatch');
	});
}

// method to fetch students of particular batch
const fetchstudents = async (req, res, next) => {
	try {
		const students = await Student.fetchStudents(req.session.userInfo.username);
		const batchregister = await Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId);
		// batchregister would look like = { _id: 5dee1a325aae3409800b2df6,
	  // batchId: 5dee1a325aae3409800b2df5,
	  // batchname: 'Maths',
	  // studentId: [ '5dee30e7b077e30f20eb2d24' ] }
	  // console.log(batchregister.studentId);
	  let studenttosend=[];
	  students.map(stud=>{
	  	// console.log('STUDENT ID' + stud._id.toString());
	  	let studentdata = batchregister.studentId.find(std=>std.id.toString() == stud._id.toString())
	  	if(studentdata){
	  		console.log('ROLL ' + studentdata.rollno);
	  		 studenttosend.push({...stud, rollno: studentdata.rollno});
	  		return stud;
	  	}
	  });
	  console.log(studenttosend); 
	  // console.log(studenttosend); it is an array of student of the particular batch
	  if(!studenttosend.length>0){
	  	return res.status(404).json({
	  		message: 'student not fetched !'
	  	});
	  }
	  return res.status(200).json({
	  		message: 'student fetched !', 
	  		students: studenttosend
	  	});
	 
	} catch (err) {
		if(!err.statusCode){
			err.statusCode = 500;
			return next(err);
		}
	}
};

// METHOD FOR SENDING PReSENT STUDENTS and emails to absents
const sendpresentstudents = (req, res, next) =>{
	let studentids = [];
	let absenttoemail = [];
	console.log('ABSENT STUDENTS' + req.body.absentstudent);
	if(req.body.absentstudent){
		absenttoemail = req.body.absentstudent.split(',');
	}
	let customMessage = req.body.message;
	console.log(req.body.message);
	console.log(absenttoemail);
	// You are getting ids of absent to sent to send emails, now prepare for sending emails
	// NOTE: SEND ABSENT SENT TO EMAIL TO DATABASE ONLY WHEN EMAIL IS SENT OTHERWISE NOT
	//console.log(req.body.studentid);		// string of present student ids
	if(!req.body.studentid){
		return res.status(422).json({message:'no studentid provided to server !'});
	}
	if(!req.body.studentid.length>0){
		return res.status(422).json({message:'no studentid provided to server !'});
	}
	 studentids = req.body.studentid.split(',');
	const presentstudents = studentids.length;
	// console.log(studentids);		// array of present students
	// console.log(currentdatetime.currentdate());
	// console.log(currentdatetime.currenttime());
	const attendenceinfo = {
		date: currentdatetime.currentdate(),
		time: currentdatetime.currenttime(),
		studentpresent: studentids,
		present: presentstudents,
		emailsent: absenttoemail
	};

	const absentemail = absenttoemail.map(id=>new mongodb.ObjectId(id));	// mapping each id to object id
	Student.findStudentsByIdArray(req.session.userInfo.username, absentemail).then(absentstudents=>{
		if(absentstudents){
			// student data fetched, taking emails of their guardians
			const guardiansemail = absentstudents.map(data=>{
				return {name:data.studentname, guardian:data.studentguardian};
			});
			for(mail of guardiansemail){

				// transporter.sendMail({
				// 	to: mail.guardian,
				// 	from:'nitin@gmail.com',
				// 	subject:'Student Absence Information',
				// 	html: `
				// 		<div style="width:95%;background:lightblue;font-family:Courier sans-serif arial monospace;padding:20px;text-alignment:justify;margin-right:auto;margin-left:auto;border-radius:5px;"><h3>Presencer</h3>Hellow sir/madam, <br> ${mail.name} is absent on ${currentdatetime.currentdate()} in ${req.session.batchInfo.batchname} class. <br> <small>This is computer generated mail, please do not reply !</small></div>
				// 	`
				// }, (err, info)=>{
				// 	if(err){
				// 		console.log(err);
				// 	}
				// 	console.log(info);
				// });

				const messageToSend = `${mail.name} is absent on ${currentdatetime.currentdate()} in ${req.session.batchInfo.batchname} class. ${customMessage}`;

				if(mail.guardian.toString().includes('@')){
					const msg = {
					to: mail.guardian,
					from:'nitin@gmail.com',
				 	subject:'Student Absence Information',
				 	html: `
						<div style="width:95%;background:lightblue;font-family:Courier sans-serif arial monospace;padding:20px;text-alignment:justify;margin-right:auto;margin-left:auto;border-radius:5px;"><h3>Presencer</h3>Hellow sir/madam, <br> ${messageToSend} <br> <small>This is computer generated mail, please do not reply !</small></div>`
					};
					sendMail(msg).then(result=>console.log(result)).catch(err=>console.log(err));
				} else {
					sendMessage(919667037909, Number('91'+mail.guardian), 'Hello sir/madam '+messageToSend+' (This is computer generated SMS, plzz do not reply!)').then(res=>console.log(res)).catch(err=>console.log(err));
				}
			}
		}
		const batchregister = new BatchRegiser(attendenceinfo);
		return batchregister.save(req.session.userInfo.username, req.session.batchInfo.batchname);
	}).then(result=>{
		if(!result){
			console.log('Attendence failed!');
			throw makeError('Attendence failed! :(');
		}
		return res.status(200).json({message:'nitin'});
	}).catch(err=>{
		return next(err);
	});
	
};

// method for fetching attendence history
const fetchattendencehistory = (req, res, next) =>{
	console.log(req.body)
	console.log('Request reached');
	const page = +req.body.page || 1;
	let left_items;
	let showmore = false;
	console.log(page);
 	BatchRegiser.countAttendence(req.session.userInfo.username, req.session.batchInfo.batchname).then(totalAttendence=>{
		left_items = totalAttendence - ITEMS_PER_PAGE*page;
		return BatchRegiser.fetchattendence(req.session.userInfo.username, req.session.batchInfo.batchname, (page-1)*ITEMS_PER_PAGE, ITEMS_PER_PAGE);
	}).then(result=>{

		if(left_items>0){
			// show more
			showmore = true;
		}

		if(!result){
			throw makeError('No attendence fetched! :(');
		}
		return res.status(200).json({message: 'attendence fetched !', data: result, showmore: showmore, status:200});
	}).catch(err=>{
		return next(err);
	});
};

const deleteattendencehistory = async (req, res, next) =>{
	if(!req.body.historyids){
		return next(makeError('Invalid Request'));
	}
	const historyids = req.body.historyids.split(',').map(id=>new mongodb.ObjectId(id));
	console.log(req.body.historyids.split(','));
	try{
		const result = await BatchRegiser.deleteHistoryByIds(req.session.userInfo.username, req.session.batchInfo.batchname, historyids);
		if(!result){
			throw makeError('History not found! :(', 401);
		}
		return res.status(201).json({message: 'history deleted !', status: 201})
	} catch (err) {
		if(!err.statusCode){
			err.statusCode = 500;
		}
		return next(err);
	}
	
};

// METHOD TO SEND DATA TO HISTORY WINDOW
const historydata = (req, res, next) => {
	const historyid = req.body.historyid;
	let totalStudents = 0;
	let presentStudents = 0;
	let absentstudents = 0;
	let date = 0;
	let time = 0;
	let batchstudents = [];
	// console.log(historyid);
	Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId).then(result=>{
		if(!result){
			throw makeError('Enable to find Total students: :(', 401);
		}
		result.studentId.map(data=>{
			totalStudents+=1;
		});

		batchstudents = result.studentId;	// student id and roll number object array
		// console.log(totalStudents);
		return BatchRegiser.findAttendenceById(req.session.userInfo.username, req.session.batchInfo.batchname, historyid);
	}).then(result=>{
		// console.log(result);
		if(!result){
			throw makeError('Enable to find attendence history! :(', 401);
		}
		date = result.date;
		time = result.time;
		presentStudents = result.present;
		absentStudents = totalStudents - presentStudents;
		if(absentStudents <0){
			absentStudents = 0;
		}
		const sendids = result.emailsent.map(id=>new mongodb.ObjectId(id));
		// console.log(sendids);	// id in mongodb id formate 
		return Student.findStudentsByIdArray(req.session.userInfo.username, sendids);
		// console.log('ABSENT STUDENTS' + absentStudents);
	}).then(result=>{
		if(!result){
			throw makeError('Students not fetched! :(', 401);
		}
	let studentstosend = result.map(student=>{
			
			let studentrollboject = batchstudents.find(id=>id.id.toString() == student._id.toString());
			
			if(studentrollboject){
				return {_id: student._id, studentname: student.studentname, studentimage: student.studentimage, rollno: studentrollboject.rollno};
			}
		});
	// console.log(studentstosend);
	return res.status(200).json({message: 'students fetched !', studentdata: studentstosend, historyinfo: {_id: historyid,date: date, time: time, totalStudents: totalStudents, presentStudents: presentStudents, absentStudents: absentStudents}});
	}).catch(err=>{
		return next(err);
	});
	
};

//METHOD FOR SENDING STUDENT INFORMATION 
const studentinfo = (req, res, next) =>{
	const studentid = req.body.studentid;
	let studentinfo;
	let totalAttendence=0;
	let present=0;
	Student.findStudentById(req.session.userInfo.username, studentid).then(student=>{
		if(!student){
			throw makeError('Student not fetched! :(', 401);
		}
		studentinfo = student;
		return BatchRegiser.fetchAllAttendence(req.session.userInfo.username, req.session.batchInfo.batchname);
	}).then(result=>{
		if(!result){
			throw makeError('Attendence not fetched! :(', 401);
		}
		result.forEach(data=>{
			totalAttendence+=1;
			if(data.studentpresent.includes(studentid.toString())){
				present+=1;
			}
		});
		return res.status(200).json({message:'student information fetched!', studentdata: studentinfo, totalAttendence:totalAttendence, present: present});
	}).catch(err=>{
		return next(err);
	});
	
};

// METHOD FOR SENDING ONLY STUDENT INFORMATION (NOT ABSENT PRESNT ETC)
const sendstudent = (req, res, next) =>{
	const studentid = req.body.studentid;
	if(!studentid){
		return next(makeError('Invalid request :(', 422));
	}
	Student.findStudentById(req.session.userInfo.username, studentid).then(result=>{
		if(!result){
			throw makeError('No student id send! :(', 401);
		}
		return res.status(200).json({message : 'student fetched', studentdata: result});
	}).catch(err=>{
		return next(err);
	});
	
};




// METHOD FOR UPDATING STUDENT
const updatestudent = (req, res, next) =>{
	console.log(req.body)
	if(!req.body){
		return next(makeError('Invalid request!', 422));
	}

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		console.log(errors);
		return next(makeError(errors.array()[0].msg, 422));
	}

	if(req.invalidimage){
		return next(makeError('Invalid image type! :(', 422));
	}
	let studentimage;
	
	Student.findStudentById(req.session.userInfo.username, req.body.studentid).then(result=>{
		if(!result){
			throw makeError('Student not found! :(', 404);
		}
		studentimage = result.studentimage;
		if(req.files.studentimage){
		// image is uploaded
			file.deleteFile('/'+studentimage);
		studentimage = req.files.studentimage[0].path;
		}

		const studenttoupdate = {
			studentname: req.body.studentname.toLowerCase(),
			studentphone: req.body.studentphone,
			studentguardian: req.body.studentguardian,
			studentaddress: req.body.studentaddress.toUpperCase(),
			studentimage: studentimage
		}

		return Student.updateStudent(req.session.userInfo.username, req.body.studentid, 'ALL', studenttoupdate);
	}).then(result=>{
		if(!result){
			throw makeError('Updation Failed! :(');
		}
		return Student.findStudentById(req.session.userInfo.username, req.body.studentid);
	}).then(student=>{
		if(!student){
			throw makeError('Updation Successful but student not fetched! :(');
		}
		return res.status(201).json({message:'Updation Success !', studentdata: student});
	}).catch(err=>{
		return next(err);
	});
	
};


const fun = async (students, username, i) => {
			let id;
			let result;

	try{

		if(!students[i]){
				return Promise.resolve({result:true});
			}
	
			id = students[i]._id;
			 result = await Student.updateStudent(username, id , 'BATCHESDECRE', '');
			 if(result){
			 	console.log('name');
			 	++i;
			 	return fun(students, username, i);
			 } else {
			 	throw new Error('Student not updated !');
			 }
		} catch (err){
			console.log(err);
			return Promise.resolve({result: false});
		}
	
};

const removeStudents = (req) => {
	const studentarray = req.body.studentarray.split(',');
	console.log('STUDENT ARRAY LENGTH IS');
	console.log(studentarray.length);
	const studentarrayobject = studentarray.map(id=>new mongodb.ObjectId(id));
	const studenttoupdateindb = [];			// students in form of [{_id:2323, batches: 3}] to update student in main table
	let studentsfromregister;
	let studentstorollbackwhendeleted = [];		// student array of deleted student;
	return Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId).then(register=>{
			if(!register){
				throw new Error('Register not fetched !');
			}
			studentsfromregister = register.studentId;	// studentid of register 
			let studentlistupdate = register.studentId.filter(stud=>{
				if(!studentarray.includes(stud.id)){
					return stud;
				}
			});
			
			let studentstoupdate = studentlistupdate.map((stud, index)=>{
				return {... stud};		// {... stud, rollno: ++index} for auto update rollno		
			});
			return Register.updateData(req.session.userInfo.username, req.session.batchInfo.batchId ,studentstoupdate, 'STUDENTIDS');
	}).then(result=>{
		if(!result){
			throw makeError('Register is not updated! :(');
		}
		return Student.findStudentsByIdArray(req.session.userInfo.username, studentarrayobject);
	}).then(students=>{
		
		if(!students){
			const error = new Error('Student not fetched!');
			error.rollbackregister = true;
			throw error;
		}
		let studentstodelete=[];
		students.forEach(stud=>{
			if(stud.batches ==1){
				studentstodelete.push(stud._id);
			} else {
				studenttoupdateindb.push({_id:stud._id, batches: stud.batches});
			}
		});

		if(studentstodelete.length>0){
			return Student.deleteStudentByIdArray(req.session.userInfo.username, studentstodelete);
		}
		return Promise.resolve({result:true});
	}).then(result=>{
		if(!result){
			const error = new Error('student not deleted from student table !');
			error.rollbackregister = true;
			throw error;
		}
		//console.log('Array to pass');
		//console.log(studenttoupdateindb);
		return fun(studenttoupdateindb, req.session.userInfo.username, 0);
	}).then(result=>{
		//console.log('after array to pass');
		//console.log(result);
		if(!result){
			throw makeError('Student is not updated! :(');
		}
		if(!result.result){
			throw makeError('Student is not updated! :(');
		}
		return Batch.findBatchById(req.session.userInfo.username,req.session.batchInfo.batchId.toString());
	}).then(batch=>{
		if(!batch)
			throw makeError('Batch not found',404);
		let leftstudents = batch.totalstudents - studentarray.length;
		return Batch.updateBatch(req.session.userInfo.username, req.session.batchInfo.batchId, leftstudents, 'STUDENTS');
	}).then(result=>{
		return Promise.resolve({message: 'student removed Successfully :)'});
	}).catch(err=>{
		//console.log(err);
		if(err.rollbackregister){
			// roll back register students
			Register.updateData(req.session.userInfo.username, req.session.batchInfo.batchId ,studentsfromregister, 'STUDENTIDS');
		}
		return Promise.reject(err);
	});

};

// method for removing student
const removestudents = (req, res, next) => {
	if(!req.body){
		return next(new Error('Invalid Request !'));
	}
	if(!req.body.studentarray && !req.body.studentarray.length>0){
		return next(new Error('Invalid Request !'));
	}
	console.log(req.body.studentarray);
	
	removeStudents(req).then(result=>{
		console.log(result);
		if(!result){
			throw makeError('Students not removed');
		}
		return res.status(200).json({message: 'student removed Successfully :)'});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
	
};

// METHOD FOR REMOVING BATCH 
const removebatch = (req, res, next) => {

	Register.findRegisterByBatchid(req.session.userInfo.username, req.session.batchInfo.batchId).then(batcReg=>{
		if(!batcReg){
			throw makeError('Regiseter not found')
		}
		if(batcReg.studentId.length>0){
			let studentids = batcReg.studentId[0].id;
			batcReg.studentId.forEach(stud=>{
				if(stud.id!=studentids) studentids = studentids+','+stud.id;
			})
			req.body.studentarray = studentids;
			return removeStudents(req);
		}
		return Promise.resolve({message:'student not present in batch, just delete the batch'});
	}).then(result=>{
		console.log(result);
		return Register.deleteReigsterByBatchId(req.session.userInfo.username, req.session.batchInfo.batchId);
	}).then(result=>{
		console.log(result);
		if(!result){
			throw makeError('Register is not deleted');
		}
		return BatchRegiser.removeAttendenceReg(req.session.userInfo.username, req.session.batchInfo.batchname);
	}).then(result=>{
		console.log(result);
		if(!result){
			throw makeError('attendence register collection is not deleted');
		}
		return Batch.deleteBatchById(req.session.userInfo.username, req.session.batchInfo.batchId);
	}).then(result=>{
		if(!result){
			throw makeError('Batch is not removed from batch collection');
		}
		return User.removebatch(req.session.userInfo._id, req.session.batchInfo.batchname);
	}).then(result=>{
		if(!result){
			throw makeError('Batch info is not removed from user collection');
		}
		req.session.batchInfo = undefined;
		req.session.save();
		return res.status(200).json({message: 'batch removed', status: 200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
};

const fgtbtchpswd = (req, res, next) => {
	const token = req.params.token;
	let decodedToken;
	try{
		decodedToken = jwt.verify(token, 'nitinsharmacs');
	} catch(err){
		console.log(err.message)
		err.data = {
			pageTitle:'Bad Request',
			heading:'Bad Request!',
			message:'You are trying to access noaccessbile resource!',
			img:'/img/icons/errorIcon.png',
			alt:'badrequest'
		};
		err.type = 'WEB';
		return next(err);
	}
	req.session.fgtbtchpswd = {
		teachername:decodedToken.teachername,
		teacherid:new mongodb.ObjectId(decodedToken.teacherid),
		valid:true
	}
	req.session.save();
	return res.render('auth/resetpassword', {pageTitle:'Reset Batch Password', authError:req.flash('authError'), formurl:'/admin/particularbatch/resetbtchpswd'});
};

const resetbtchpswd = (req, res, next) => {
	if( !req.session.fgtbtchpswd || !req.session.fgtbtchpswd.valid){
		const err = new Error('Bad Request');
		err.data = {
			pageTitle:'Bad Request',
			heading:'Bad Request!',
			message:'You are trying to access noaccessbile resource!',
			img:'/img/icons/errorIcon.png',
			alt:'badrequest'
		};
		err.type = 'WEB';
		return next(err);
	}
	const password = req.body.newpassword;
	console.log(password)
	bcrypt.hash(password, 12).then(passcode=>{
		if(!passcode)
			throw makeError('Something not good, try again');
		return Batch.updateBatch(req.session.fgtbtchpswd.username, req.session.fgtbtchpswd.batchid, passcode, 'PASSWORD');
	}).then(result=>{
		if(!result)
			throw makeError('Password not updated, try again!');
		req.session.fgtbtchpswd = undefined;
		req.session.save();
		return res.render('infoPages/infopage', {pageTitle:'Password Changed', heading:'Password changed', img:'/img/checkicon.png', alt:'Info', message:'Your batch password has successfully changed.', redirect:true});

	}).catch(err=>{
		console.log(err);
		req.session.fgtbtchpswd = undefined;
		req.session.save();
		err.data = {
			pageTitle:'Error',
			heading:'Opps ! There is Error!',
			img:'/img/icons/errorIcon.png',
			message:err.message,
			alt:'error'
		};
		err.type = 'WEB';
		return next(err);
	})
	
};

module.exports = {
	changeimage: changeimage,
	updateprofile:updateprofile,
	updatepassword:updatepassword,
	addstudent: addstudent,
	editbatch: editbatch,
	fetchstudents: fetchstudents,
	sendpresentstudents:sendpresentstudents,
	fetchattendencehistory:fetchattendencehistory,
	deleteattendencehistory: deleteattendencehistory,
	historydata: historydata,
	studentinfo:studentinfo,
	sendstudent:sendstudent,
	updatestudent:updatestudent,
	removestudents:removestudents,
	removebatch: removebatch,
	fgtbtchpswd:fgtbtchpswd,
	resetbtchpswd:resetbtchpswd
};