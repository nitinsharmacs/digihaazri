const  sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');	

const mail = () => {
	return sgMail;
};

exports.mail = mail;