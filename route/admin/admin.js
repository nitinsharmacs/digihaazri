const express = require('express');
const router = express.Router();

//importing third party packages
const {body, sanitizeBody} = require('express-validator');

//importing controller
const adminController = require('../../controllers/admin/admin');

//importing middleware
const auth = require('../../middleware/auth').auth;
const batchauth = require('../../middleware/batchauth').batchauth;

router.get('/dashboard', auth, adminController.getDashboard);
router.get('/batch',auth, adminController.getBatch);
router.get('/student', auth, adminController.getStudent);
router.get('/teacher', auth, adminController.getTeacher);
router.get('/fgtprofpswd/:token',adminController.fgtprofpswd);
router.post('/openprofile', auth, adminController.openprofile);
router.post('/updateprofile', [body('userphone','Invalid Phone!').isMobilePhone(), body('useremail', 'Invaild Email !').isEmail(), body('user_address', 'Invalid Address !').not().isEmpty()] ,auth, adminController.updateprofile);
router.post('/updatepassword', [body('newpassword', 'Password must has min 5 letters and max 12 letters !').isLength({min: 5, max: 12}), body('confirmpassword').custom((value, {req})=>{
	if(value != req.body.newpassword){
		throw new Error('Password does not match !');
	}
	return true;
})] ,auth, adminController.updatepassword);
router.post('/updateprofilepassword', [body('newprofilepassword', 'Password must has min 5 letters and max 12 letters !').isLength({min:5, max:12}), body('confirmprofilepassword').custom((value, {req})=>{
	if(value != req.body.newprofilepassword){
		throw new Error('Passcodes do not Match !');
	}
	return true;
})] ,auth, adminController.updateprofilepassword);
router.post('/updateprofileimage', auth, adminController.updateprofileimage);
router.post('/createbatch', auth,[body('batchname').isLength({min: 3}).withMessage('Error : Invalid batchname !'), sanitizeBody('batchname').customSanitizer(value=>value.toLowerCase()) ,body('teachername', 'Error: Invalid teacher name !').isLength({min: 3}), sanitizeBody('teachername').customSanitizer(value=>value.toLowerCase()), body('teacherid', 'Invalid Teacher Id!').not().isEmpty() ,body('batchpassword').isLength({min: 5, max: 12}).withMessage('Error : Password must has atleast 5 and max 12 letters !')] , adminController.postCreatebatch);
router.post('/addteacher', auth, [body('teachername', 'Invalid teachername!').not().isEmpty(), sanitizeBody('teachername').customSanitizer(value=>value.toLowerCase()) ,body('teacherphone', 'Invalid Phone Number !').isMobilePhone(), body('teacheremail', 'Invalid Teacher Email!').isEmail().trim() ,body('teacheraddress', 'Invalid teacher address !').not().isEmpty()] ,adminController.addteacher);
router.post('/openbatch/:batchid', auth, adminController.postOpenbatch);
router.get('/particularbatch', auth, batchauth, adminController.getParticularbatch);
router.post('/fetchbatches', auth, adminController.fetchbatches);	// fetching batches for batch window
router.post('/fetchstudents', auth ,adminController.fetchstudents);
router.post('/fetchteachers', auth, adminController.fetchteachers);
router.post('/resetprofpswd', adminController.resetprofpswd);
module.exports = router;