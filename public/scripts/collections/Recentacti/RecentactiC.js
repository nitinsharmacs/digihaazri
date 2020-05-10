define(['../../models/Recentacti/RecentactiM'],(RecentactiM)=>{
	const RecentactiC = Backbone.Collection.extend({
		urlRoot:'/config/user/getrectacti',
		model:RecentactiM
	});
	return RecentactiC;
});