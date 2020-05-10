const util = require('util');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
	apiKey: '12fc0d4c',
	apiSecret: 'suediIy1DKBn485H',
});

const sendMessage = (From, To, text) => {
	return new Promise((resolve, reject)=>{
		nexmo.message.sendSms(From, To, text, (err, res)=>{
			if(err){
				return reject(err);
			}
			if(res.messages[0]['status'] !== '0') {
				return resolve({message: 'SMS not sent successfully', error: res.messages[0]['error-text']});
			}
			return resolve({message:'SMS sent successfully', error: null});
		});
	});
};

module.exports = sendMessage;
