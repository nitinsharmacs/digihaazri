define(['../../models/Moremenu/MoreMenuM'], (MoreMenuM)=>{
	const MoreMenuC = Backbone.Collection.extend({
		model: MoreMenuM
	});
	return MoreMenuC;
});