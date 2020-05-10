
define(['../../models/Batches/BatchBoxM'], (BatchBoxM)=>{
	const BatchBoxC = Backbone.Collection.extend({
		url:'/admin/fetchbatches',
		model: BatchBoxM
	});
	return BatchBoxC;
});

