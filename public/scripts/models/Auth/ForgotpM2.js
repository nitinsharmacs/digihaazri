define(['jquery','underscore','backbone'], ($,_,Backbone)=>{
	const ForgotpM2 = Backbone.Model.extend({
		urlRoot:'/auth/resetpassword'
	});
	return ForgotpM2;
});