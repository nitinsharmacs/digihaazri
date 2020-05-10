const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:'ramujha266@gmail.com',
		pass:'nitin123nitin'
	}
});

const sendMail = (mailOptions) => {
	return transporter.sendMail(mailOptions);
};

module.exports = sendMail;