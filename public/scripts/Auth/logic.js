define(['../models/Auth/SigninM','../views/Auth/SigninV'],(SigninM,SigninV)=>{
	const resendOTP = () => {
		$('.resendotp').html(`<div class='processingloader'></div>`)
		fetch('http://localhost:3001/auth/sendOTP', {
			method:'POST',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({
				usernameEmail:$('input[name="user"]').val(),
				type:'REST'
			})
		}).then(res=>res.json()).then(result=>{
			console.log(result);
			$('.resendotp').html('Not get yet?, resend Again!');
		}).catch(err=>{
			console.log(err);
			alert(err.message);
		});
	};

	const verifyOTP = (e) => {
		console.log(e);
		e.preventDefault()
	};

	$('.login-form').submit((e)=>{
		if($('input[name=otp]').val() === ''){
			e.preventDefault();
			return alert('Enter OTP first!');
		}
		if($('input[name=usernameEmail]').val()===""){
			e.preventDefault();
			return alert("Enter Username Or Email!");
		}
		if($('input[name=password]').val()===''){
			e.preventDefault();
			return alert('Enter Your password!');
		}
		if($('input[name=newpassword]').val() === ''){
			e.preventDefault();
			return alert('Enter New Password');
		}
		if($('input[name=confirmpassword]').val() !== $('input[name=newpassword]').val()){
			e.preventDefault();
			return alert('Passwords do not matched!');
		}


		$('button[type=submit]').html('<div class="processingloader"></div>').prop('disabled', true);
	})
	
	return {
		resendOTP:resendOTP,
		verifyOTP:verifyOTP
	};
});