const express = require('express');
const router = express.Router();

//importing third party packages
const {body, oneOf} = require('express-validator/check');

//importing teacher controller
const teacherController = require('../../controllers/teacher/teacher');

// importing util file
const email = require('../../util/validator');

//importing middleware
const auth = require('../../middleware/auth').auth;
const batchauth = require('../../middleware/batchauth').batchauth;

router.get('/fgtbtchpswd/:token', teacherController.fgtbtchpswd);
router.post('/changeprofilepicture', auth, batchauth, teacherController.changeimage);//change profile picuter
router.post('/updateprofile', auth, batchauth,[body('teachername', 'Error: Invalid Teachername !').isLength({min: 3}), body('userphone', 'Error: Invalid Phone !').isMobilePhone(), body('useremail', 'Error: Invalid Email !').isEmail(), body('user_address', 'Error: Invalid Address !').isLength({min: 3})] ,teacherController.updateprofile);//update profile
router.post('/updatepassword', auth, batchauth,[body('newpassword', 'Error: Password must has atleast 5 and max 12 letters !').isLength({min: 5, max: 12}), body('confirmpassword').custom((value, {req})=>{
	if(value != req.body.newpassword){
		throw new Error('Error: Password do not match !')
	}
	return true;
})], teacherController.updatepassword);	//update teacher password

router.post('/addstudent', [body('studentname').not().isEmpty().withMessage("Invalid Student Name"), body('studentphone').isMobilePhone().withMessage('Invalid Mobile !'), body('studentage').custom((value, {req})=>{
	if(value < 5){
		throw new Error('Invalid Age !');
	}
	return true;
}), body('studentaddress').isLength({min: 5}).withMessage('Invalid Address'), oneOf([body('studentguardian').isMobilePhone(), body('studentguardian').isEmail()], 'Invalid Guardian Email or Phone !')] ,auth, batchauth, teacherController.addstudent);

router.delete('/removestudents', auth, batchauth, teacherController.removestudents);
router.delete('/removebatch', auth, batchauth, teacherController.removebatch);
router.post('/editbatch', [body('batchname', 'Invalid Batch Name !').not().isEmpty(), body('teachername', 'Invalid Teacher Name !').not().isEmpty()] ,auth, batchauth, teacherController.editbatch);

router.post('/fetchstudent', auth , batchauth, teacherController.fetchstudents);
router.post('/sendpresentstudents', auth, batchauth, teacherController.sendpresentstudents);
router.post('/fetchattendencehistory', auth, batchauth, teacherController.fetchattendencehistory);
router.post('/deleteattendencehistory', auth, batchauth, teacherController.deleteattendencehistory);
router.post('/historydata', auth, batchauth, teacherController.historydata);
router.post('/studentinfo', auth, batchauth, teacherController.studentinfo);
router.post('/sendstudent', auth, batchauth, teacherController.sendstudent);
router.post('/updatestudent', [body('studentname', 'Invalid Student Name !').not().isEmpty(), body('studentphone', 'Invalid Contact Number!').isMobilePhone(), oneOf([body('studentguardian', 'Invalid email!').isEmail(), body('studentguardian', 'Invalid Phone !').isMobilePhone()], 'Invalid Guardian Email Or Phone !'), body('studentaddress').not().isEmpty()] ,auth, batchauth, teacherController.updatestudent);
router.post('/resetbtchpswd', teacherController.resetbtchpswd);
module.exports = router;