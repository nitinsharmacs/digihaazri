const  sgMail = require('@sendgrid/mail');
sgMail.setApiKey('');	

const mail = () => {
	return sgMail;
};

exports.mail = mail;
