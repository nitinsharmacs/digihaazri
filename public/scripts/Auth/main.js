require.config({
	paths:{
		jquery:'../lib/jquery-min',
		underscore:'../lib/underscore-min',
		backbone:'../lib/backbone-min'
	}
});

let resendOTP,verifyOTP ;
require(['./logic'], (Logic)=>{
	resendOTP = Logic.resendOTP;
	verifyOTP = Logic.verifyOTP;
});