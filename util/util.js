const Batch = require('../models/batch');
const Register = require('../models/registers');


const makeError = (message, statusCode) => {
	console.log('IN util' + statusCode);
	const error = new Error(message);
	if(statusCode){
		error.statusCode = statusCode;
	} else {
		error.statusCode = 500;
	}
	return error;
};

const updateBatchRecord = (req, batchinfo, sourceinfo) => {
	return Register.findRegisterByBatchid(req.session.userInfo.username, batchinfo.batchid).then(result=>{
		if(!result){
			console.log('Fetching Register collection Error')
			throw new Error('Internal server Error :(');
		}
		return Batch.updateBatch(req.session.userInfo.username, batchinfo.batchid, result.studentId.length || 0, 'STUDENTS');
	}).then(result=>{
		if(!result){
			console.log('Batch not updated');
			throw new Error('Error, Please try again later :(');
		}
		console.log('Batch updated')
		return Promise.resolve('Batch updated');
	});

};

module.exports = {
	makeError: makeError,
	updateBatchRecord: updateBatchRecord
};