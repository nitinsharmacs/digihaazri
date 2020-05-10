const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});


class UserConfig {
	constructor(config){
		this.userConfig = {
			userId: config.userId,
			settings:config.settings || [],
			notifications: config.notifications || [],
			recActivities:config.recActivities || []
		}
	}
	save(){
		return db.collection('users_config').insertOne(this.userConfig);
	}

	// fetch recActivities
	static fetchRecActi(userid){
		console.log(userid)
		return db.collection('users_config').findOne({userId:userid}).then(res=>res?res.recActivities:null);
	}
	// delete recActivity
	static delRecActi(userid,activityid){
		return this.fetchRecActi(userid).then(result=>{
			if(!result)
				return null;
			let updated = result.filter(val=>val.id!=activityid);
			return db.collection('users_config').updateOne({userId:userid},{$set:{recActivities:updated}});
		})
	}
	// fetch notifications
	static fetchNotifications(userid){
		return db.collection('users_config').findOne({userId:userid}).then(res=>{
			if(!res)
				return null;
			if(res && res.notifications.length<=0) 
				return res.notifications;
			let sendNotif = res.notifications.filter(val=>!val.seen);
			return sendNotif;
		});
	}
	// setting notifications seen and date
	static setNotifications(userid,notifinfo){
		return this.fetchNotifications(userid).then(notif=>{
			if(notif.length<=0) 
				return Promise.resolve('empty notifications');
			let updateNotif = notif.map(val=>{
				return {...val,...notifinfo[val.id]}
			});
			return db.collection('users_config').updateOne({userId:userid},{$set:{notifications:updateNotif}});
		});
	}
}

module.exports = UserConfig;