define(['jquery', 'underscore', 'backbone', '../../models/History/HistoryBoxM'], ($, _, Backbone, HistoryBoxM)=>{
	const HistoryBoxC = Backbone.Collection.extend({
		url:'/admin/particularbatch/fetchattendencehistory',
		model: HistoryBoxM
	});
	return HistoryBoxC;
});