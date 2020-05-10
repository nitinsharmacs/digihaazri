define(['jquery', 'underscore', 'backbone'], ($, _, Backbone)=>{
	const ConfirmationM = Backbone.Model.extend({
		validate: function(attrs){
			if(!attrs.method && typeof attrs.method != "function"){
				return 'Invalid attribute is passed for method or not passed'
			}
		}
	});
	return ConfirmationM; 
});