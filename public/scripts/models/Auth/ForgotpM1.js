define(['jquery','underscore','backbone'],($,_,Backbone)=>{
	const ForgotpM1 = Backbone.Model.extend({
		urlRoot:'/auth/sendOTP',
		urlRoot2:'/auth/forgotpassword',
	});
	return ForgotpM1;
});