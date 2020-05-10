const mongodb = require('mongodb');
const database = require('../util/dbconnection').database;
let db;
database((database)=>{
	db = database;
});

class Config {
	constructor(config){
		this.config = {
			batchId: config.batchId,
			settings:config.settings || [],
			notifications: config.notifications || [],
			recActivities:config.recActivities || []
		}
	}
	save(username){
		return db.collection(username+'_batch_config').insertOne(this.config);
	}
	static fetchNotifications(username,batchid){
		return db.collection(username+'_batch_config').findOne({batchId:batchid}).then(res=>{
			if(!res)
				return null;
			if(res && res.notifications.length<=0) 
				return res.notifications;
			let sendNotif = res.notifications.filter(val=>!val.seen);
			return sendNotif;
		});
	}
	static setNotifications(username,batchid,notifinfo){
		return this.fetchNotifications(username,batchid).then(notif=>{
			if(notif.length<=0) 
				return Promise.resolve('empty notifications');
			let updateNotif = notif.map(val=>{
				return {...val,...notifinfo[val.id]}
			});
			return db.collection(username+'_batch_config').updateOne({batchId:batchid},{$set:{notifications:updateNotif}});
		});
	}
}

module.exports = Config;