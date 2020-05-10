define([], ()=>{
	const BatchInfoM = Backbone.Model.extend({
		validate: function(attrs){
			if(!attrs.infoboxHeading){
				return 'Heading is required'
			}
		}
	});
	return BatchInfoM;
});