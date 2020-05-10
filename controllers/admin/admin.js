// CONSANTS
const STUDENT_PER_PAGE = 4;

//importing third party packages
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator/check');
const mongodb = require('mongodb');

//importing User model
const User = require('../../models/users');
//importing Batch model
const Batch = require('../../models/batch');
//importing Register model
const Register = require('../../models/registers');
//importing Teacher model 
const Teacher = require('../../models/teacher');
// importing routeCookie util method
const routeCookie =  require('../../util/routeCookie');
// importing Student model
const Student = require('../../models/student');

// importing util methods
const file = require('../../util/file');	// for deleting files
const currentdatetime = require('../../util/currentdatetime');	// for getting date and time


// importing util for making error
const makeError = require('../../util/util').makeError;
// importing mail util method
const sendMail = require('../../util/sendMail');

const getDashboard  = (req, res, next) => {
	const route = routeCookie(req, res, '/admin/dashboard');
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(user){
				return res.render('admin/dashboard', {pageTitle: 'Dashboard: Home', path:'/dashboard',userinfo: user, forteacher: false, currentwindow: null, previouswindow: null, error: req.flash('adminerror')});
		} else {
			return next(new Error('Error'));
		}
	}).catch(err=>console.log(err));
	
};


const getBatch = (req, res, next) =>{
	const route = routeCookie(req, res, '/admin/batch');

	let userinfo;
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(!user){
			return res.redirect('/auth/login');
		}
		userinfo = user;
		return Batch.countBatches(req.session.userInfo.username);
	}).then(batchcount=>{
		console.log(batchcount)
		let batchPresent = false;
		if(!batchcount<=0){
			batchPresent = true;
		}
		console.log(batchPresent);
		return res.render('admin/batcheswindow', {pageTitle: 'Dashboard: Batches', path: '/batch', userinfo: userinfo, batchPresent:batchPresent , forteacher: false, error: req.flash('adminerror'), currentwindow: route.currentwindow, previouswindow: route.previouswindow});

	}).catch(err=>{
		console.log(err);
	});

};

// METHOD FOR FETCHING BATCHES FOR BATCH WINDOW
const fetchbatches = (req, res, next) => {

	console.log('request get');

	Batch.fetchbatches(req.session.userInfo.username).then(batches=>{
		if(!batches){
			console.log('Batches not found');
			throw makeError('Batches not found! :(', 404);
		}
		return res.status(200).json({message:'batches fetched !', data: batches, status: 200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	})
};


// METHOD FOR GET STUDENT WINDOW
const getStudent = (req, res, next) => {
	const route = routeCookie(req, res, '/admin/student');
		User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
			if(user){
				res.render('admin/studentwindow', {pageTitle: 'Dashboard: Student', path: '/student', userinfo: user, forteacher: false, error: req.flash('adminerror'), currentwindow: route.currentwindow, previouswindow: route.previouswindow});
			}
		}).catch(err=>console.log(err));

};

//METHOD FOR GET TEACHER WINDOW
const getTeacher	 = (req, res, next) => {
	const route = routeCookie(req, res, '/admin/teacher');
	let userinfo;
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		console.log(route);
			if(!user){
				throw new Error('Internal server Error, plzz try again...');
			}
			userinfo = user;
			return Teacher.countTeachers(req.session.userInfo.username);
		}).then(teacher => {
			const teacherPresent = teacher>0?true:false;
			return res.render('admin/teacherwindow', {pageTitle: 'Dashboard: Teacher', path: '/teacher', userinfo: userinfo, forteacher: false, error: req.flash('adminerror'), currentwindow: route.currentwindow, previouswindow: route.previouswindow, teacherPresent: teacherPresent});
		}).catch(err=>{
			console.log(err);
			req.flash('adminerror',err.message);
			return res.render('admin/teacherwindow', {pageTitle: 'Dashboard: Teacher', path: '/teacher', userinfo: userinfo, forteacher: false, error: req.flash('adminerror'), currentwindow: route.currentwindow, previouswindow: route.previouswindow, teacherPresent: false});
		});
};

//method for creating a new batch
	

const postCreatebatch = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array()[0].msg;
		res.status(442);
		req.flash('adminerror', error);
		res.redirect('/admin/batch');
	}

	const { batchname, teachername, teacherid, batchpassword } = req.body;

	// checking for batch presence by its name
	Batch.findBatchByName(req.session.userInfo.username,  batchname).then(isBatchFound=>{
		if(isBatchFound){
			throw makeError('Batch is already present! :(', 422);
		}

		// checking for teacher presence
		return Teacher.findTeacher(req.session.userInfo.username, teachername,teacherid);
	}).then(isTeacherFound=>{
		if(!isTeacherFound){
			throw makeError('Teacher is not valid! :(', 422);
		}

		// making batch
		const batchpasscode = bcrypt.hashSync(batchpassword, 10);
		let batchimageUrl = 'images/education.png';
		if(req.files && req.files.uploadimage && req.files.uploadimage[0]) {
			batchimageUrl = req.files.uploadimage[0].path;
		}
		const batchInfo = {
			batchname: batchname,
			teachername: teachername,
			teacherid: isTeacherFound._id,
			batchpassword: batchpasscode,
			batchimageurl: batchimageUrl, 
			createdat: currentdatetime.currentdate()+','+currentdatetime.currenttime()
		};
		const newBatch = new Batch(batchInfo);
		return newBatch.save(req.session.userInfo.username);
	}).then(result=>{
		if(!result){
			throw makeError('Batch not created! (Internal Server Error!) :(');
		}

		// making register entry for created Batch
		const batchInfoToRegister = {
			batchId: result.ops[0]._id,
			batchname: result.ops[0].batchname
		};
		const newRegEntry = new Register(batchInfoToRegister);
		return newRegEntry.save(req.session.userInfo.username);
	}).then(result=>{
		if(!result){
			console.log('Batch Entry is not made after batch creation');
			throw makeError('Internal Server Error! :(');
		}
		// adding batchinformation into users collection's document also
		return User.updateUser('Batches', {batchname: batchname, teachername: teachername}, req.session.userInfo._id.toString());
	}).then(result=>{
		console.log(result);
		if(!result){
			console.log('All is done but created batch info is not added into users collection');
			throw makeError('Internal Server Error! :(');
		}
		req.flash('adminerror', 'Batch is created successfully! :)');
		return res.redirect('/admin/batch');
	}).catch(err=>{
		console.log(err);
		if(req.files && req.files.uploadimage && req.files.uploadimage[0]){
			file.deleteFile('/'+req.files.uploadimage[0].path);
		}	
		req.flash('adminerror', err.message);
		return res.redirect('/admin/batch');
	});

};
//method to open particular batch window
const postOpenbatch = (req, res, next)=>{
	const batchid = req.params.batchid;
	const batchname = req.body.batchname;
	const passcode = req.body.batchpassword;
	let batchinfo;
	Batch.findBatchById(req.session.userInfo.username, batchid).then(result=>{
		//result would an object of that batch
		if(!result){
			throw new Error('Batch Not found!');
		}
		batchinfo = result;
			//batch is present and now matching the password
		return bcrypt.compare(passcode, result.batchpassword);
	}).then(match=>{
		if(!match){
			throw new Error('Invalid Password!');
		}
			//password matched
			//updating the session
			req.session.batchInfo = {
				batchId: batchinfo._id,
				teacherId: batchinfo.teacherid, 
				batchname: batchinfo.batchname
			};
			req.session.save(err=>{
				if(err){
					throw new Error('Internal Server Error!');
				}
				return res.redirect('/admin/particularbatch');
			});
	}).catch(err=>{
		console.log(err);
		if(!err.statusCode){
			err.statusCode = 500;
		}
		req.flash('adminerror', err.message);
		return res.redirect('/admin/batch');
	});
}

// METHOD FOR GET PARTICULAR BATCH
const getParticularbatch = (req, res, next) =>{
	const route = routeCookie(req, res, '/admin/particularbatch');

 		let teacherinfo;
		let batchinfo;
		//NOW LOAD ABOUT THE TEACHER AND BATCH FOR PARTICULAR BATCH WINDOW
		Teacher.fetchTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId).then(teacherinformation=>{
			if(!teacherinformation){
				console.log('Error while fetching Teacher information');
				throw makeError('Internal Server Error, try later ! :(');
			}
			teacherinfo = teacherinformation;
			return Batch.findBatchById(req.session.userInfo.username, req.session.batchInfo.batchId);
		}).then(batchinfo=>{
			batchinfo = batchinfo;
			console.log(teacherinfo);
			res.render('teacher/particularbatch',  {pageTitle: 'Batch : '+ req.session.batchInfo.batchname, path: '/batch', userinfo: {username: teacherinfo.teachername, userphone: teacherinfo.teacherphone, useremail: teacherinfo.teacheremail, useraddress:teacherinfo.teacheraddress, userimageurl: teacherinfo.teacherimageurl}, batchname: req.session.batchInfo.batchname ,batchimageurl: batchinfo.batchimageurl,forteacher: true, error: req.flash('particularbatcherror'),showbackward:{valid: true, url:''}, showforward: {valid: false, url:''}, currentwindow:route.currentwindow, previouswindow:route.previouswindow});
		}).catch(err=>{
			if(!err.statusCode){
				err.statusCode = 500;
			}
			return next(err);
		});
}
//method for changing the profilepicture of the teacher/user
// const changeimage = (req, res, next)=>{
// 	if(req.file){
// 		//if image file is valid
// 		const imagepath = req.file.path;
// 		Teacher.updateTeacher(req.session.userInfo.username, req.session.batchInfo.teacherId, imagepath, 'PROFILEIMAGE').then(result=>{
// 				console.log(result);
// 				return res.redirect('/admin/particularbatch');
// 		}).catch(err=>console.log(err));
// 	} else {
// 		return res.redirect('/admin/particularbatch');
// 	}
// }

const openprofile = (req, res, next) => {
	const passcode = req.body.passcode;
	if(!passcode){
		console.log('Invalid request');
		return next(makeError('Invalid Request ! &#128543', 401));
	}
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(!user){
			console.log('User not found!');
			throw makeError('User not found! &#128532', 404);
		}
		return bcrypt.compare(passcode, user.profilepasscode);
	}).then(matchfound=>{
		if(!matchfound){
			throw makeError('Please Enter a valid Passcode! &#128548;', 404);
		}
		return res.status(200).json({message: 'User found', status: 200});
	}).catch(err=>{
		if(!err.statusCode){
			err.statusCode = 500;
		}
		return next(err);
	})
};

const updateprofile = (req, res, next) => {
	// console.log(req.headers.referer);		// this would give the window url
	let windowinfo;
	let redirectpath;
	if(req.headers.referer){
		 windowinfo = req.headers.referer.split('/admin')[1];
		 if(windowinfo){
		 	redirectpath = '/admin'+windowinfo;
		 }
	}
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		req.flash('adminerror', error[0]);
		return res.redirect(redirectpath || '/admin/dashboard');
	}
	const userinfo = {
		userphone: req.body.userphone,
		useremail: req.body.useremail,
		useraddress: req.body.user_address
	};
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(!user){
			throw new Error('Invalid User !');
		}
		return User.findUser('', userinfo.useremail);
	}).then(user=>{
		if(user){
			if(user.useremail != userinfo.useremail){
				throw new Error('Choose different Email !');
			}
		}
		return User.updateUser('PROFILE', userinfo, req.session.userInfo._id);
	}).then(result=>{
		if(!result){
			throw new Error('Profile not Updated !');
		}
		console.log(windowinfo);
		req.session.userInfo.useremail = userinfo.useremail;
		req.session.save((err)=>{
			if(!err){
				req.flash('adminerror', 'Profile updated !');
				return res.redirect(redirectpath || '/admin/dashboard');
			}
			throw new Error('Session Updation problem !');
		})
	}).catch(err=>{
		req.flash('adminerror', err.message);
		return res.redirect(redirectpath || '/admin/dashboard');
	})
};
// METHOD FOR UPDATING USER PASSWORD 
const updatepassword = (req, res, next) => {
	let windowinfo;
	let redirectpath;
	if(req.headers.referer){
		 windowinfo = req.headers.referer.split('/admin')[1];
		 if(windowinfo){
		 	redirectpath = '/admin'+windowinfo;
		 }
	}
	const oldpassword = req.body.oldpassword;
	const errors = validationResult(req);
	console.log(errors);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		req.flash('adminerror', error[0]);
		return res.redirect('/admin'+windowinfo);
	}

	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(!user){
			throw new Error('Database Fetching Error, try later . . . ');
		}
		return bcrypt.compare(oldpassword, user.password);
	}).then(passwordMatch=>{
		if(!passwordMatch){
			throw new Error('Invalid Old password !');
		}
		if(req.body.newpassword !== req.body.confirmpassword){
			throw new Error('Password not matching!');
		}
		return bcrypt.hash(req.body.newpassword, 12);
	}).then(passcode=>{
		if(!passcode){
			throw new Error('Error in Password !');
		}
		return User.updateUser('PASSWORD', passcode, req.session.userInfo._id);
	}).then(result=>{
		if(!result){
			throw new Error('Password Updation Failed !');
		}
		req.flash('adminerror', 'Password Changed Successfully!');
		return res.redirect(redirectpath || '/admin/dashboard');
	}).catch(err=>{
		req.flash('adminerror', err.message);
		return res.redirect(redirectpath || '/admin/dashboard');
	});

	
};
const updateprofilepassword = (req, res, next) => {
	let windowinfo;
	let redirectpath;
	if(req.headers.referer){
		 windowinfo = req.headers.referer.split('/admin')[1];
		 if(windowinfo){
		 	redirectpath = '/admin'+windowinfo;
		 }
	}
	const oldprofilepassword = req.body.oldprofilepassword;
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		req.flash('adminerror', error[0]);
		return res.redirect( redirectpath || '/admin/dashboard');
	}
	User.findUser(req.session.userInfo.username, req.session.userInfo.useremail).then(user=>{
		if(!user){
			throw new Error('Database fetching Error, try later ...');
		}
		return bcrypt.compare(oldprofilepassword, user.profilepasscode);
	}).then(passwordMatch=>{
		if(!passwordMatch){
			throw new Error('Old passcode is Invalid !');
		}
		if(req.body.newprofilepassword !== req.body.confirmprofilepassword){
			throw new Error('Password not matched !');
		}
		return bcrypt.hash(req.body.newprofilepassword, 12);
	}).then(passcode=>{
		if(!passcode){
			throw new Error('Profile passcode not updated !');
		}
		return User.updateUser('PROFILEPASSCODE', passcode, req.session.userInfo._id);
	}).then(result=>{
		if(!result){
			throw new Error('Profile passcode not updated, try later !');
		}
		req.flash('adminerror', 'Profile passcode updated !');
		return res.redirect(redirectpath || '/admin/dashboard');
	}).catch(err=>{
		req.flash('adminerror', err.message);
		return res.redirect(redirectpath || '/admin/dashboard');
	});
};

// METHOD FOR UPDATING PROFILE PICTURE
const updateprofileimage = (req, res, next) => {
	let windowinfo;
	let redirectpath;
	if(req.headers.referer){
		 windowinfo = req.headers.referer.split('/admin')[1];
		 if(windowinfo){
		 	redirectpath = '/admin'+windowinfo;
		 }
	}
	if(!(req.files && req.files.profileimageinput && req.files.profileimageinput.length>0)){
		// console.log(req.files.profileimageinput[0].path);
		req.flash('adminerror', 'Profile Image not Updated !');
		return res.redirect(redirectpath || '/admin/dashboard');
	}
	const imagepath = req.files.profileimageinput[0].path;
		User.updateUser('PROFILEIMAGE', imagepath, req.session.userInfo._id).then(result=>{
			if(!result){
				throw new Error('Profile image not Updated !');
			}
				req.flash('adminerror', 'Profile image updated !');
				return res.redirect(redirectpath || '/admin/dashboard');
		}).catch(err=>{
			req.flash('adminerror', err.message);
			return res.redirect(redirectpath || '/admin/dashboard');
	});
};

// method for fetching students for student window
const fetchstudents = (req, res, next) => {
	let page = +req.body.page || 0;
	let totalstudents;
	let left_items; 
	let showmore = false;
	Student.countStudents(req.session.userInfo.username).then(count=>{
		totalstudents = count;
		return Student.fetchStudentsLimit(req.session.userInfo.username, page, STUDENT_PER_PAGE);
	}).then(students=>{
		if(!students){
			throw new Error('No students fetched !');
		}
		left_items =  totalstudents - STUDENT_PER_PAGE*(page+1);
		
		if(left_items>0){
			showmore  = true;
		}
		return res.status(200).json({message: 'student fetched', data: students, showmore:showmore, page: page, status: 200});
	}).catch(err=>{
		return next(err);
	});
};

//METHOD FOR FETCHING TEACHERS FOR TEACHER WINDOW
const fetchteachers = (req, res, next) => {
	Teacher.fetchTeachers(req.session.userInfo.username).then(teachers=>{
		return res.status(200).json({message:'teachers fetched', data: teachers});
	}).catch(err=>{
		return next(err);
	});
};


// METHOD FOR ADDING TEACHER
const addteacher = (req, res, next) => {
	// {
//   imageinfo: 'teacher',
//   teachername: 'nitin',
//   teacherphone: 'nitin',
//   teacheremail: 'nitin',
//   teacheraddress: 'ntiin'
// }
	const errors = validationResult(req);

	let imageurl = 'images/usericon.png';
	if(req.files.teacherimage){
		imageurl = req.files.teacherimage[0].path;
	}

	if(!errors.isEmpty()){
		console.log(errors.array()[0].msg);
		if(req.files.teacherimage){
				file.deleteFile('/'+imageurl);
		}
		return next(makeError(errors.array()[0].msg, 422));
	}

	const teacherid = req.body.teachername + Math.round(1000+Math.random()*1000);
	const teacherinfo = {...req.body, imageinfo: imageurl, teacherid: teacherid, addedat: currentdatetime.currentdate()+' '+currentdatetime.currenttime()};
	const teacher = new Teacher(teacherinfo);
	teacher.save(req.session.userInfo.username).then(result=>{
		if(!result){
			throw makeError('Teacher is already present! :(', 422);
		}
		const msg = {
					to: result.ops[0].teacheremail,
					from:'nitin@gmail.com',
				 	subject:'Teacher Added Successfully!',
				 	html: `
						<div style="width:95%;background:lightblue;font-family:Courier sans-serif arial monospace;padding:20px;text-alignment:justify;margin-right:auto;margin-left:auto;border-radius:5px;"><h3>Presencer</h3>
						<h3>Teacher Id is ${result.ops[0].teacherid} .</h3>
						<p>Please save this id as this will require to make batch.</p>
						<br> <small>This is computer generated mail, please do not reply !</small></div>`
				};
		sendMail(msg);
		return res.status(201).json({message:'teacher added', data: result.ops[0]});
	}).catch(err=>{
		console.log(err);
		if(req.files.teacherimage){
				file.deleteFile('/'+imageurl);
		}
		return next(makeError(err.message));
	});
};

// method for sending reset profile password window to user
const fgtprofpswd = (req, res, next) => {
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
	req.session.fgtprofpswd = {
		username:decodedToken.username,
		userId:new mongodb.ObjectId(decodedToken.userId),
		valid:true
	}
	req.session.save();
	return res.render('auth/resetpassword', {pageTitle:'Reset Profile Password', authError:req.flash('authError'), formurl:'/admin/resetprofpswd'})
};
const resetprofpswd = (req, res, next) => {
	if( !req.session.fgtprofpswd || !req.session.fgtprofpswd.valid){
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
		return User.updateUser('PROFILEPASSCODE', passcode, req.session.fgtprofpswd.userId);
	}).then(result=>{
		if(!result)
			throw makeError('Password not updated, try again!');
		req.session.fgtprofpswd = undefined;
		req.session.save();
		return res.render('infoPages/infopage', {pageTitle:'Password Changed', heading:'Password changed', img:'/img/checkicon.png', alt:'Info', message:'Your profile password has successfully changed.',redirect:true});

	}).catch(err=>{
		console.log(err);
		req.session.fgtprofpswd = undefined;
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
	getDashboard:getDashboard,
	getBatch: getBatch,
	getStudent:getStudent,
	getTeacher: getTeacher,
	postCreatebatch:postCreatebatch,
	postOpenbatch:postOpenbatch,
	getParticularbatch:getParticularbatch,
	openprofile: openprofile,
	updateprofile: updateprofile,
	updatepassword:updatepassword,
	updateprofilepassword: updateprofilepassword,
	updateprofileimage:updateprofileimage,
	fetchstudents:fetchstudents,
	fetchteachers: fetchteachers,
	fetchbatches:fetchbatches,
	addteacher: addteacher,
	fgtprofpswd:fgtprofpswd,
	resetprofpswd:resetprofpswd
}