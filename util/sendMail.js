const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:'rahuljhasharma123',
		pass:'nitin123nitin'
	}
});

const sendMail = (mailOptions) => {
	return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
