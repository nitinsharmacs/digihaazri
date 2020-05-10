define([],()=>{
	const NotificationM = Backbone.Model.extend({
		urlRoot:'/config/teacher/notifications',
	});
	return NotificationM;
});