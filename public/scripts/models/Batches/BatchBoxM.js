
define([], ()=>{
	const BatchBoxM = Backbone.Model.extend({
		urlRoot:'/admin/fetchbatches'
	});
	return BatchBoxM;
});

