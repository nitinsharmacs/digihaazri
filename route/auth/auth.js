const express = require('express');

//importing 3rd party packages
const { body} = require('express-validator/check');

//importing controllers for auth
const auth = require('../../controllers/auth/auth');

const router = express.Router();

router.get('/login', auth.getLogin);
router.get('/forgotpassword', auth.getForgotPassword);
router.get('/newpassword', auth.getNewPassword);
router.post('/login',auth.postLogin);
router.post('/signup',[body('username').isLength({min: 5, max: 12}).withMessage('Invalid Username'), body('useremail').isEmail().normalizeEmail().withMessage('Invalid Email'), body('password').isLength({min: 5, max: 12}).withMessage('Invalid password'), body('confirmpassword').custom((value, {req})=>{
	if(req.body.password != value){
		throw new Error('Password do not match');
	}
	return true;
})] ,auth.postSignup);	//router for user signup 
router.post('/logout', auth.postLogout);	//logout route
router.post('/sendOTP', auth.sendOTP); // sendOTP for forgot user password
router.post('/forgotpassword', auth.verifyOTP); 
router.post('/resetpassword', auth.resetPassword);

module.exports = router;