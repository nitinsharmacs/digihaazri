const Config = require('../../../models/batch_config');

// import util methods 
const makeError = require('../../../util/util').makeError;
const getNotifications = (req, res, next) => {
	console.log('get notifications')
	Config.fetchNotifications(req.session.userInfo.username,req.session.batchInfo.batchId).then(result=>{
		console.log('result is')
		console.log(result)
		return res.status(200).json({message:'Notifications Fetched!', data:result, status:200});
	}).catch(err=>{	
		console.log(err);
		next(err);
	});
};

const deleteNotifications = (req, res, next) => {
	let notif = JSON.parse(req.body.notif);
	Config.setNotifications(req.session.userInfo.username, req.session.batchInfo.batchId,notif).then(result=>{
		if(!result) makeError('notif updation failed');
		return res.status(201).json({message:'Updation successful',status:201});
	}).catch(err=>{
		console.log(err);
		next(err);
	});
};

module.exports = {
	getNotifications:getNotifications,
	deleteNotifications:deleteNotifications
};