define(['jquery','underscore','backbone'],($,_,Backbone)=>{
	const ForgotpV1 = Backbone.View.extend({
		events: {
			'click button[for="subbutton"]':'sendOTP',
			'click button[for="submit"]':'submit',
		},
		sendOTP: function(){
			if(this.$('input[name="username"]').val() === '') {
				alert('Please enter Username Or Email');
				return false;
			}
			this.$('button[for="subbutton"]').prop('disabled', true).html('<div class="processingloader"></div>');
			const formdata = new FormData();
			formdata.append('username', this.$('input[name="username"]').val());
			this.$('.forgotpError').html('Not get, send again').fadeIn(500);
		fetch(this.model.urlRoot, {
			method:'POST',
			body: formdata
		}).then(res=>res.json()).then(result=>{
			if(result.status != 201){
				const error = new Error(result.message);
				error.status = result.status;
				throw error;
			}
			this.$('.forgotpError').css({'background':'green','color':'white'}).html(result.message).fadeIn(500);
			this.$('button[for="subbutton"]').prop('disabled', false).html('GET OTP');
			setTimeout(()=>{
				this.$('.forgotpError').fadeOut(500);
			}, 2000);
		}).catch(err=>{
			this.$('.forgotpError').css({'background':'lightcoral','color':'yellow'}).html(err.message).fadeIn(500);
			this.$('button[for="subbutton"]').prop('disabled', false).html('GET OTP');
			setTimeout(()=>{
				this.$('.forgotpError').fadeOut(500);
			}, 2000);
		});
		},
		submit: function(){

			let username = this.$('input[name="username"]').val();
			let OTP = this.$('input[name="otp"]').val();
			if(username == '') {
				alert('Enter Username Or Email');
				return false;
			}
			if(OTP == '') {
				alert('Enter OTP!');
				return false;
			}
			this.$('button[for="submit"]').prop('disabled', true).html('<div class="processingloader"></div>');
			const formdata = new FormData();
			formdata.append('username', username);
			formdata.append('otp', OTP);
			fetch(this.model.urlRoot2, {
				method:'POST',
				body: formdata
			}).then(res=>res.json()).then(result=>{
				if(result.status != 200) {
					const error = new Error(result.message);
					error.status = result.status;
					throw error;
				}
				setTimeout(()=>{
					this.$('button[for="submit"]').prop('disabled', false).html('Login');
					window.location = '/admin/dashboard';
				}, 1000)
			}).catch(err=>{
				console.log(err);
				alert(err.message);
				this.$('button[for="submit"]').prop('disabled', false).html('Login');
			});
		},
		render: function(){
			const viewContent = `
				<h1>Forgot Password</h1>
				<div class='login-form'>
					<input type='text' placeholder='Username Or Email' name='username' >
					<span class='forgotpError'>error</span>
					<button for='subbutton'>GET OTP</button>
					<input type='number' placeholder="OTP" name='otp' >
					<button for='submit'>Login</button>
					<a href='/'>Login</a>
				</div>
			`;
			this.$el.html(viewContent);
			return this;
		}
	});
	return ForgotpV1;
});