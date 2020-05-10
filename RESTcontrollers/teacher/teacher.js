const jwt = require('jsonwebtoken');
const sendMail = require('../../util/sendMail');
const makeError = require('../../util/util').makeError;

//importing models
const Batch = require('../../models/batch');
const Teacher = require('../../models/teacher');

const fgtbtchpswd = (req, res, next) => {
	const batchid = req.body.batchid;
	if(!batchid){
		return next(makeError('Invalid Request',400));
	}
	let teachername,teacherid;
	Batch.findBatchById(req.session.userInfo.username, batchid).then(batch=>{
		if(!batch)
			throw makeError('Batch Not Found!');
		teachername = batch.teachername;
		teacherid = batch.teacherid;
		return Teacher.fetchTeacher(req.session.userInfo.username, teacherid);
	}).then(teacher=>{
		if(!teacher)
			throw makeError('Something wrong, please try again');
		const token = jwt.sign({
			username:req.session.userInfo.username,
			batchid:batchid
		}, 'nitinsharmacs', {expiresIn:1200});

		const msg = {
			to:teacher.teacheremail,
			from:'ramujha266@gmail.com',
			subject:'Forgot Batch Password',
			html:`
			<div>
				<p>You have requested to reset your Batch password, click on the given link to reset your password</p>
				<a href="http://localhost:3001/admin/particularbatch/fgtbtchpswd/${token}" target='blank'>click here to reset your password</a>
				<p>This mail is confidential and do not forward this anybody.</p>
			</div>
			`
		};
		sendMail(msg);
		return res.status(200).json({message:'Link sent successful!', status:200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
};

module.exports = {
	fgtbtchpswd:fgtbtchpswd
};