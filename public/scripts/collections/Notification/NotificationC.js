define(['../../models/Notification/NotificationM'],(NotificationM)=>{
	const NotificationC = Backbone.Collection.extend({
		url:'/config/teacher/notifications',
		delUrl:'/config/teacher/delnotifications',
		model:NotificationM
	});
	return NotificationC;
});