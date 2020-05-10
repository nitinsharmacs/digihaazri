define(['jquery','underscore','backbone','../../models/Auth/ForgotpM1','./Forgotp/ForgotpV1'],($,_,Backbone, ForgotpM1, ForgotpV1)=>{
	const SigninV = Backbone.View.extend({
		events: {
			'click .forgotpassword':'forgotpassword',
		},
		forgotpassword: function(){
			// this.$el.selector = .logindiv
			$('.errormessage').remove();
			const forgotpm1 = new ForgotpM1();
			const forgotpv1 = new ForgotpV1({model: forgotpm1, el: this.$el.selector});
			forgotpv1.render();
		},	
		render:function(){
			const viewContent = `
				<img src="/img/icons/signinLogo.png" alt='login'>
				<form class='login-form' name='login-form' method='POST' action='/auth/login'>
					<input type='text' placeholder='Username Or Email' name='usernameEmail'>
					<input type="password" name="password" placeholder='Enter Password'>
					<button type='submit'>Login</button>
					<p class='forgotpassword'>Forgot password?</p>
				</form>
			`;
			this.$el.html(viewContent);
			return this;
		}
	});
	return SigninV;
});