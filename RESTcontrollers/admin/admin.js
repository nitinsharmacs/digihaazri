const jwt = require('jsonwebtoken');
const sendMail = require('../../util/sendMail');

const fgtprofpswd = (req, res, next) => {
	const token = jwt.sign({
		username:req.session.userInfo.username,
		userId:req.session.userInfo._id.toString()
	}, 'nitinsharmacs', {expiresIn:600});
	const msg = {
		to:req.session.userInfo.useremail,
		from:'ramujha266@gmail.com',
		subject:'Forgot Profile Password',
		html:`
		<div>
			<p>You have requested to reset your Profile password, click on the given link to reset your password</p>
			<a href="http://localhost:3001/admin/fgtprofpswd/${token}" target='blank'>click here to reset your password</a>
			<p>This mail is confiential and do not forward this anybody.</p>
		</div>
		`
	} 
	sendMail(msg);
	return res.status(200).json({message:'Link sent successful!', status:200});
};

module.exports = {
	fgtprofpswd:fgtprofpswd
};