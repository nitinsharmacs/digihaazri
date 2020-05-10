const Config = require('../../../models/user_config');

// import util methods 
const makeError = require('../../../util/util').makeError;

// getting recent activities
const getRectActi = (req, res, next) => {
	const userId = req.session.userInfo._id;
	Config.fetchRecActi(userId).then(result=>{
		if(!result) makeError('Recent activities not fetched');
		return res.status(200).json({message:'Activities fetched',data:result,status:200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	})
};
//deleting recent activites
const delRectActi = (req, res, next) => {
	const activityId = req.body.id;
	Config.delRecActi(req.session.userInfo._id,activityId).then(result=>{
		if(!result) makeError('Activity not deleted');
		return res.status(201).json({message:'Activity deleted',status:201});
	}).catch(err=>{
		console.log(err);
		next(err);
	});
};
// getting notifications
const getNotifications = (req, res, next) => {
	const userid = req.session.userInfo._id;
	Config.fetchNotifications(userid).then(result=>{
		if(!result) makeError('Notifications do not fetched');
		res.status(200).json({message:'Notifications fetched',data:result,status:200})
	}).catch(err=>{
		console.log(err);
		next(err);
	});
};


const deleteNotifications = (req, res, next) => {
	const userid = req.session.userInfo._id;
	let notif = JSON.parse(req.body.notif);
	Config.setNotifications(userid,notif).then(result=>{
		if(!result) makeError('notif updation failed');
		return res.status(201).json({message:'Updation successful',status:201});
	}).catch(err=>{
		console.log(err);
		next(err);
	});
};


module.exports = {
	getRectActi:getRectActi,
	delRectActi:delRectActi,
	getNotifications:getNotifications,
	deleteNotifications:deleteNotifications
};