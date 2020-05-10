//importing 3rd party modules
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');

// importing util files 
const makeError = require('../../util/util').makeError;
//const sgMail = require('../../util/mail').mail();
const sendMail = require('../../util/sendMail');

//importing User model
const User = require('../../models/users');
// importing User Config model 
const Config = require('../../models/user_config');
//db is now ready for using database
const getLogin = (req, res, next) =>{
	return res.render('auth/signin', {pageTitle: 'Login', loginerror: req.flash('loginerror')});
};

//method for login
const postLogin = (req, res, next) =>{


	User.findUser(req.body.usernameEmail, req.body.usernameEmail).then(response=>{
		console.log(response);
		if(response){
			//user is present and now checking password
			bcrypt.compare(req.body.password, response.password).then(result=>{
				if(result){
					//password matched
					req.session.logined = true;
					req.session.userInfo = {
						_id: response._id,
						username: response.username,
						useremail: response.useremail,
					};
					req.session.save(err=>{
						console.log(err)
						res.redirect('/admin/dashboard');
					});
					
				} else {
					//password not matched
					req.flash('loginerror', 'Invalid User !');		//flashing error
					res.redirect('/auth/login');
				}
			}).catch(err=>console.log(err));
		} else {
			//user is not present
			req.flash('loginerror', 'Invalid User !');		//flashing error
			res.redirect('/auth/login');
		}

	}).catch(err=>console.log(err));
	
}

//method for signup
const postSignup = (req, res, next)=>{

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		const error = errors.array().map(err=>err.msg);
		return res.status(422).json({message:error[0], status:422});
	}

	User.findUser(req.body.username, req.body.useremail).then(response=>{
		if(response){
			//user is present
			return res.status(400).json({message:'User is present', status: 400});
		}  
		//user is not present
		return bcrypt.hash(req.body.password, 12);
		
	}).then(passcode=>{
		if(!passcode){
			throw makeError('Internal Server Error');
		}
		const userInformation = {
			username: req.body.username,
			useremail: req.body.useremail,
			password: passcode
		}
		const newUser = new User(userInformation);
		return newUser.save();
		}).then(result=>{
			if(!result){
				throw makeError("Signup process Failed :(");
			}
			const config = new Config({userId:result.ops[0]._id});
			config.save();

			res.status(201).json({message:'User is added', status:201});
		}).catch(err=>{
			console.log(err);
			return next(err);
		})
};

//method for logout
const postLogout = (req, res, next) =>{
	req.session.destroy(err=>{
		console.log(err);
		res.redirect('/');
	})
};

const getForgotPassword = (req, res, next) => {
	res.render('auth/forgotpassword', {pageTitle:'Forgot Password', authError: req.flash('authError') });
};
const getNewPassword = (req, res, next) => {
	console.log(req.session.forgotp)
	if( !req.session.forgotp || !req.session.forgotp.valid)
		res.redirect('/');
	res.render('auth/newpassword', {pageTitle:'Verify OTP', authError:req.flash('authError'), user:req.session.forgotp.user});
};

// method for sending OTP to particular email
const sendOTP = (req, res, next) => {
	console.log(req.body);
	const username = req.body.usernameEmail;
	let OTP = Math.floor(1000+Math.random()*9000);
	let userinfo;
	User.findUser(username, username).then(response=>{
		console.log(response);
		userinfo = response;
		if(!response) throw makeError('User not found', 404);
		const msg = {
					to: response.useremail,
					from:'ramujha266@gmail.com',
				 	subject:'Password Reset OTP',
				 	html: `
				 		<p>OTP to reset password is ${OTP}</p>
				 		<p style="font-weight:bold;font-size:1.2rem;font-color:red;">Please do not share it with anyone!</p>
						`
					};
					sendMail(msg).then(result=>console.log(result)).catch(err=>console.log(err));
					// sgMail.send(msg).then(result=>console.log(result)).catch(err=>console.log(err));
					return User.saveOTP(username, username, OTP);
	}).then(response=>{
		console.log(response);
		if(!response) throw makeError('Process failed, please try again');
		if(req.body.type === 'REST')
			return res.status(201).json({message:'OTP sent successfully', status:201});
		req.session.forgotp = {
			valid:true,
			user:username,
			userId:userinfo._id
		};
		req.session.save();
		res.redirect('/auth/newpassword');
	}).catch(err=>{
		console.log(err);
		if(req.body.type === 'REST')
			return next(err);
		req.flash('authError', err.message);
		res.redirect('/auth/forgotpassword');
	});
};

const verifyOTP = (req, res, next) => {
	const username = req.body.user;
	const OTP = +req.body.otp;
	User.findUser(username,username).then(user=>{
		console.log(user)
		if(!user) throw makeError('User not found!', 404);
		if(user.OTP.expires < Date.now()) throw makeError('Time Out!!');
		if(user.OTP.OTP != OTP) throw makeError('OTP does not matched!', 422);
		res.render('auth/resetpassword', {pageTitle:'Reset Password', authError:req.flash('authError'), formurl:undefined});
	}).catch(err=>{
		console.log(err);
		req.flash('authError', err.message);
		res.redirect('/auth/newpassword');
	});
};

const resetPassword = (req, res, next) => {
	console.log(req.body);
	console.log(req.session.forgotp)
	if(!req.session.forgotp.valid){
		console.log('NOT VALID')
		req.flash('loginerror', 'Session Timeout!');
		return res.redirect('/');
	}
	const username = req.session.forgotp.user;
	const newpassword = req.body.newpassword;
	bcrypt.hash(newpassword, 12).then(password=>{
		if(!password)
			throw makeError('Something went wrong, try again');
		
		return User.updateUser('PASSWORD', password, req.session.forgotp.userId);
	}).then(result=>{
		console.log(result);
		if(!result)
			throw makeError('Password not changed, try again');
		req.session.forgotp = undefined;
		req.session.save();
		req.flash('loginerror', 'Password changed, Now Login!');
		res.redirect('/');
	}).catch(err=>{
		console.log(err);
		req.flash('authError', err.message);
		res.render('auth/resetpassword', {pageTitle:'Reset Password', authError:req.flash('authError')});
	})

};

module.exports = {
	getLogin: getLogin,
	getForgotPassword:getForgotPassword,
	getNewPassword:getNewPassword,
	postLogin:postLogin,
	postSignup:postSignup,
	postLogout: postLogout,
	sendOTP: sendOTP,
	verifyOTP: verifyOTP,
	resetPassword:resetPassword
}