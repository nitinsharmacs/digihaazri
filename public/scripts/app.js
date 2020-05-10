const emailchecker = value =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );

// IMPORTANT INITIAL VARIABLES
let loadedstudentdata;
let arrayofpresentstudents = [];
let historyinformation;


//method for changing the image src of profile image
const readUrl = (input) =>{
			if(input.files && input.files[0]){
				var reader = new FileReader();
				reader.onload = (e) =>{
					$('.profilepicture-img').attr('src', e.target.result);
				};
				reader.readAsDataURL(input.files[0]);
			}
			$('.yesimagebutton').removeClass('disabled');
			$('.yesimagebutton').prop('disabled', false);	//making upload button enabled
		}

const readUrl2 = (input, component) =>{
	//component is the class of img whose src to change
	if(input.files && input.files[0]){
		var reader = new FileReader();
		reader.onload = (e) =>{
			$(component).css('display', 'block');
			$(component).attr('src', e.target.result);
			$('.chooseimagelabel').text('Change')
		};
		reader.readAsDataURL(input.files[0]);
	}
	if(component == '.update-studentimage' && input.files && input.files[0]);{
		enableupdatebutton();
	}
}



//method for making controldiv, verticalcontrols and navigation blur 
const blur = () =>{
	$('.verticalcontrols, .controldiv, .navigation, .horizontalcontrols').addClass('blur');
	$('body').css('overflow', 'hidden');
}
const noblur = () =>{
	$('.verticalcontrols, .controldiv, .navigation, .horizontalcontrols').removeClass('blur');
	$('body').css('overflow', 'auto');
}
//script for opening profile pop up

//method for opening dialog box for opening particular batch
const opendialog = (batchid, batchname, batchimageurl) =>{
	$('.dialog-form').attr('action', '/admin/openbatch/'+batchid);
	blur();
	$('#forgotbatch').attr('onclick',`fgtbtchpswd('${batchid}')`);
	$('.batchnamespan').addClass('spanslideup');
	$('.batchnameinput').val(batchname);
	$('.dialog-header span img').attr('src', '/'+batchimageurl);
	$('.dialogboxdiv').addClass('show');
	$('.dialog').addClass('show');
	$('.batchpasswordinput').focus();
}


// method for validation of createbatch form
const validateCreatebatch = () =>{
	if(document.forms['createbatch-form']['batchname'].value == ''){
		alert('Enter batch name !');
		return false;
	}
	if(document.forms['createbatch-form']['teachername'].value == ''){
		alert('Enter teacher name !');
		return false;
	}
	if(document.forms['createbatch-form']['batchpassword'].value != ''){
		let password = document.forms['createbatch-form']['batchpassword'].value;

		if(password.length<5 || password.length>12 ){
			console.log(password + '\t' + password.length);
			alert('Password must has atleast 5 and less than 13 letters !');
			return false;
		}
	} else {
		alert('Enter password');
		return false;
	}
	
	
}

// method for validation for teacher profile updation
const validateprofile = (isteacher) =>{
	if(isteacher){
		if(document.forms['profile-form']['teachername'].value == ''){
		alert('Error: Empty teacher name !');
		return false;
		}
	}
	
	if(document.forms['profile-form']['userphone'].value == ''){
		alert('Error: Empty Phone Block !');
		return false;
	}
	if(document.forms['profile-form']['useremail'].value == ''){
		alert('Error: Empty Email Block !');
		return false;
	} else {
		const email = document.forms['profile-form']['useremail'].value;
		if(!emailchecker(email)){
			alert('Invalid email !');
			return false;
		}
	}

	if(document.forms['profile-form']['user_address'].value == ''){
		alert('Error: Empty Address Block !');
		return false;
	}

}

// method for useprofile/teacherprofile updatepassword validation
const validatePassword = (isprofile) =>{
	if(!isprofile){
		if(document.forms['updatepassword-form']['newpassword'].value == ''){
		alert('Error: Empty Password Block !');
		return false;
		} else {
			if(document.forms['updatepassword-form']['newpassword'].value.length< 5 || document.forms['updatepassword-form']['newpassword'].value.length>12){
				alert('Error: Password must has min 5 letters and max 12 letters !');
				return false;
			}
		}
		if(document.forms['updatepassword-form']['confirmpassword'].value == ''){
			alert('Error: Empty Confirm password !');
			return false;
		} else {
			if(document.forms['updatepassword-form']['newpassword'].value != document.forms['updatepassword-form']['confirmpassword'].value){
				alert('Error: Password does not match !');
				return false;
			}
		}
	} else {
		if(document.forms['updateprofilepassword-form']['newprofilepassword'].value == ''){
		alert('Error: Empty Password Block !');
		return false;
		} else {
			if(document.forms['updateprofilepassword-form']['newprofilepassword'].value.length< 5 || document.forms['updateprofilepassword-form']['newprofilepassword'].value.length>12){
				alert('Error: Password must has min 5 letters and max 12 letters !');
				return false;
			}
		}
		if(document.forms['updateprofilepassword-form']['confirmprofilepassword'].value == ''){
			alert('Error: Empty Confirm password !');
			return false;
		} else {
			if(document.forms['updateprofilepassword-form']['newprofilepassword'].value != document.forms['updateprofilepassword-form']['confirmprofilepassword'].value){
				alert('Error: Password does not match !');
				return false;
			}
		}
	}
	
};

// method for validating student added information
const validateStudent = (info) =>{
	const studentname = $('.studentnameinput');
	const studentphone = $('.studentphoneinput');
	const studentguardian = $('.studentguardianinput');
	const studentaddress = $('.studentaddressinput');
	if(studentname.val() == ''){
		alert(`Fill ${info} Name!`);
		return false;
	}
	if(studentphone.val() == ''){
		alert(`Fill ${info} Phone Block !`);
		return false;
	}
	if(studentguardian.val() == ''){
		if(info === 'teacher'){
			alert('Fill Teacher Email!')
		} else {
			alert('Fill Guardian Block !');
		}
	
		return false;
	}

	
	if(studentaddress.val() == ''){
		alert(`Fill ${info} Address !`);
		return false;
	}
	addstudent(info);
}

// method for adding students
const addstudent = (info) =>{
	document.querySelector('.studentaddbutton').innerHTML = 'Adding';
	$('.studentaddbutton').prop('disabled', true);
	$('.studentaddbutton').css('opacity', '0.3');
	const studentname = $('.studentnameinput');
	const studentphone = $('.studentphoneinput');
	const studentguardian = $('.studentguardianinput');
	const studentaddress = $('.studentaddressinput');
	const studentimage = document.getElementById('studentuploadimageinput');
	console.log(studentimage.files.length)		// object of file
	const formdata = new FormData();
	formdata.append('imageinfo', info);
	formdata.append( info + 'name', studentname.val());
	formdata.append(info+'phone', studentphone.val());
	formdata.append(info == 'teacher'?'teacheremail':'studentguardian', studentguardian.val());
	formdata.append( info + 'address', studentaddress.val());
	if(studentimage.files.length != 0){
		formdata.append(info + 'image', studentimage.files[0]);
	}
	let endpoint = '/particularbatch/addstudent';
	if(info === 'teacher'){
		endpoint = '/addteacher';
	}
	console.log(endpoint);
	console.log(info);
	fetch('/admin' +endpoint, {
		method: 'POST', 
		body: formdata
	}).then(res=>{
		console.log('RESPONSE IS ' + res);
		if(res.status != 201){
			return Promise.resolve({result: false, message: res.json()});
		}
		return Promise.resolve({result: true, message: res.json()});
	}).then(result=>{
		if(result.result){
			// no error and student is insereted
			// console.log(result); 
			console.log(result.message);
			document.querySelector('.studentaddbutton').innerHTML = 'Add';
			$('.studentaddbutton').prop('disabled', false);
			$('.studentaddbutton').css('opacity', '1');
			resetForm($('.addstudent'));
			if(info == 'teacher'){
				result.message.then(data=>{
					$('.showmessagespan').fadeIn(100).text('Added with id ' + data.data.teacherid + '. Plzz save it! (Check your mail!)');
				});
			} else {
					$('.showmessagespan').fadeIn(100).text('Added !');
				setTimeout(()=>{
					$('.showmessagespan').fadeOut(100);
				}, 7000);
			}
						
		} else {	
			// there is error in the validation || student not created etc.
			result.message.then(message=>{
				// alert(message.message);
				console.log(message);
				$('.showmessagespan').slideDown(100).text(message.message);
				document.querySelector('.studentaddbutton').innerHTML = 'Add';
				$('.studentaddbutton').prop('disabled', false);
				$('.studentaddbutton').css('opacity', '1');
			})
		}
	}).catch(err=>console.log(err));

};


//METHOD FOR OPENING STUDENT UPDATE BLOCK
const openupdatewindow = (studentid) => {
	const studentname = $('.studentnameinput1');
	const studentphone = $('.studentphoneinput1');
	const studentguardian = $('.studentguardianinput1');
	const studentaddress = $('.studentaddressinput1');
	const formdata = new FormData();
	formdata.append('studentid', studentid);
	fetch('/admin/particularbatch/sendstudent', {
		method: 'POST',
		body: formdata
	}).then(res=>{
		if(res.status != 200){
			throw new Error('student not fetched !');
		}
		return res.json();
	}).then(result=>{
		console.log(result);
		if(!result){
			throw new Error('student not fetched !');
		}
		document.querySelector('.update-studentimage').setAttribute('src', `/${result.studentdata.studentimage}`);
		studentname.val(result.studentdata.studentname);
		studentname.focusin();
		studentphone.val(result.studentdata.studentphone);
		studentphone.focusin();
		studentguardian.val(result.studentdata.studentguardian);
		studentguardian.focusin();
		studentaddress.val(result.studentdata.studentaddress);
		studentaddress.focusin();

		document.querySelector('.updatestudent-updatebutton').setAttribute('onclick',`return (validateUpdateStudent('${studentid}'));`)
		document.querySelector('.update-studentimage').setAttribute('src', `/${result.studentdata.studentimage}`);
	}).catch(err=>console.log(err));

	$('.studentinfo').removeClass('slideright');
	$('.studentinfo').addClass('slideleft');
	setTimeout(()=>{
		$('.studentinfo').css({'display':'none'});
		$('.updatestudent').css({'display':'block'});
		$('.updatestudent').removeClass('slideleft');
		$('.updatestudent').addClass('slideright');
	}, 250);

};

// METHOD FOR MAKING UPDATE STUDENT BUTTON VISIBLE OR ABLE
const enableupdatebutton = () =>{
	$('.updatestudent-updatebutton').prop('disabled', false);
	$('.updatestudent-updatebutton').addClass('enable');
	return true;
}

// METHOD FOR VALIDATION UPDATE STUDENT 
const validateUpdateStudent = (studentid) =>{

	const studentname = $('.studentnameinput1');
	const studentphone = $('.studentphoneinput1');
	const studentguardian = $('.studentguardianinput1');
	const studentaddress = $('.studentaddressinput1');
	let studentimage = document.querySelector('.update-studentimage').src.split('student/')[1];	// extracted only image name
	// console.log(document.querySelector('.update-studentimage'))
	if(studentimage){
		studentimage = studentimage.replace('%20', ' ')
		// console.log(studentimage.replace('%20', ' '));
	} else {
		if(document.querySelector('.update-studentimage').src.split('/images')[1] == '/usericon.png'){
			studentimage = 'userimage';
		}
	}
	// console.log(studentimage)
	//checking that student info is changed or not
	if(loadedstudentdata.length>0){
		let studata = loadedstudentdata.find(data=>data._id.toString() == studentid.toString());
		if(studata){
			// console.log(studata.studentimage);
			// console.log(studata.studentimage.split('student\\')[1]);
			let studimage = studata.studentimage.split('student\\')[1];		// extracted only image name
				if(!studimage){
					studimage = 'userimage';
					// console.log(studimage);
				}
			if(studata.studentname == studentname.val() && studata.studentphone == studentphone.val() && studata.studentguardian == studentguardian.val() && studata.studentaddress == studentaddress.val() && studimage == studentimage){
				alert('No Student data changed !');
				return false;
			}
		}
	}
	if(studentname.val() == ''){
		alert('Fill Student Name !');
		return false;
	}
	if(studentphone.val() == ''){
		alert('Fill Student Phone Block !');
		return false;
	}
	if(studentguardian.val() == ''){
		alert('Fill Guardian Block !');
		return false;
	}
	
	if(studentaddress.val() == ''){
		alert('Fill Student Address !');
		return false;
	}
	updatestudent(studentid);
};

// METHOD FOR UPDATION OF STUDENT 

const updatestudent = (studentid) =>{
	const studentcard = document.getElementById(studentid);
	const studentcardimage = studentcard.childNodes[0].childNodes[1];
	const studentcardname= studentcard.childNodes[1];

	const studentname = $('.studentnameinput1');
	const studentphone = $('.studentphoneinput1');
	const studentguardian = $('.studentguardianinput1');
	const studentaddress = $('.studentaddressinput1');
	const studentimage= document.getElementById('changestudentimage');

	const updationbutton = $('.updatestudent-updatebutton');
	updationbutton.text('Updating').prop('disabled', true).addClass('disabled');

	const formdata = new FormData();
	formdata.append('studentid', studentid);
	formdata.append('imageinfo', 'student');
	formdata.append('studentname', studentname.val());
	formdata.append('studentphone', studentphone.val());
	formdata.append('studentguardian', studentguardian.val());
	formdata.append('studentaddress', studentaddress.val());
	if(studentimage.files.length > 0){
		formdata.append('studentimage', studentimage.files[0]);
	}
	fetch('/admin/particularbatch/updatestudent', {
		method: 'POST', 
		body: formdata
	}).then(res=>{
		if(res.status != 201){
			const error = new Error('Updation failed!');
			error.status = 500;
			error.data = res.json();
			throw error;
		}
		return res.json();
	}).then(result=>{
		if(!result){
			const error = new Error('Updation failed!');
			error.status = 201;
			error.data = res.json();
			throw error;
		}
		
		setTimeout(()=>{
			$('.showmessagespan').fadeIn(400).text('Updated');
			updationbutton.text('Update').prop('disabled', false).removeClass('disabled');
		}, 500);
		
		studentcardimage.src =  '/'+result.studentdata.studentimage;
		const namearray = studentcardname.innerHTML.split('(');
		studentcardname.innerHTML = result.studentdata.studentname+'('+namearray[1];

		// updating the studentinfo window
		loadstudentinfo(studentid, true);

		// updating loaded student data array
		const updatedstudents = loadedstudentdata.map(studentinformation=>{
			if(studentinformation._id.toString() == studentid.toString()){
				return {...result.studentdata, _id: result.studentdata._id.toString(), rollno: studentinformation.rollno};
			} else {
				return studentinformation;
			}
		});
		loadedstudentdata = updatedstudents;	// updating the loaded student data;

		// updating absent student window
		addabsentstudents(false);	 		// false is not for showing confirmation popup
		const studentlist = document.querySelector('.absentwindow-studentlist');
		studentlist.innerHTML = "";
		loadabsentstudent();
	

		setTimeout(()=>{
			removeupdatewindow();
				$('.showmessagespan').fadeOut(500);
		}, 1200);
	}).catch(err=>{
		if(err.status == 500){
			err.data.then(msg=>{
				$('.showmessagespan').fadeIn(500).text(msg.message);
				setTimeout(()=>{
					$('.showmessagespan').fadeOut(500);
					updationbutton.text('Update').prop('disabled', false).removeClass('disabled');
				}, 2000);
			});
		} else {

		}
	});
};


// METHOD FOR REMOVING STUDENT UPDATION BLOCK

const removeupdatewindow = () =>{
	$('.updatestudent').removeClass('slideright');
	$('.updatestudent').addClass('slideleft');
	setTimeout(()=>{
		$('.updatestudent').css({'display':'none'});
		$('.studentinfo').css({'display':'block'});
		$('.studentinfo').removeClass('slideleft');
		$('.studentinfo').addClass('slideright');
	}, 250);
	// making update button disabled
		$('.updatestudent-updatebutton').prop('disabled', true);
		$('.updatestudent-updatebutton').removeClass('enable');
};


// METHOD FOR VALIDATING EDIT BATCH
const validateeditbatch = () =>{
	const batchname = document.querySelector('.batchnameinput').value;
	const teachername = document.querySelector('.edit-teachernameinput').value;
	if(batchname == ''){
		alert('Fill Batch Name !');
		return false;
	}
	if(teachername == ''){
		alert('Fill Teacher Name !');
		return false;
	}
	
};

// method for backward button
const backward = (value) =>{
	let backwardobject;
	// loading backwardstack
	let storagedata = window.sessionStorage.getItem('backwardstack');
	if(storagedata){
		if(storagedata.length>0){
			backwardobject = JSON.parse(storagedata);
			let len = backwardobject.stack.length-1;
			console.log(len);
			let url = backwardobject.stack[len];
			backwardobject.stack.pop();
			window.sessionStorage.setItem('backwardstack', JSON.stringify(backwardobject));
			// console.log(backwardobject);
			window.location = url;
		}
	}	
	fillforwardstack(value);
}
// method for forward button
const forward = () =>{

	let forwardstackstring = window.sessionStorage.getItem('forwardstack');
	if(forwardstackstring){
		if(forwardstackstring.length>0){
			let forwardstack = JSON.parse(forwardstackstring);
			if(forwardstack){
				let url = forwardstack.stack[forwardstack.stack.length -1];
				forwardstack.stack.pop();
				window.sessionStorage.setItem('forwardstack', JSON.stringify(forwardstack));
				window.location = url;
			}
		}
	}
}



// METHOD FOR LOADING ATTENDENCE HISTORY


// METHOD FOR SELECTING HISTORY BOX 

// METHOD FOR OPENING HISTORY WINDOW

// METHOD FOR SENDING DOWNLOADING HISTORY PDF REQUEST TO SERVER
const downloadhistory = (historyid) =>{
	
	window.location = '/downloads/attendencehistory/'+historyid;
	// if(historyinformation){
	// 	const formdata = new FormData();
	// 	formdata.append('_id', historyinformation._id);
	// 	fetch('http://localhost:3001/downloads/attendencehistory', {
	// 		method: 'POST', 
	// 		body: formdata
	// 	}).then(res=>res.json()).then(result=>{
	// 		console.log(result);
	// 	}).catch(err=>console.log(err));
	// }
};

// METHOD FOR CLOSING HISTORY WINDOW
const closehistory = () =>{
	$('.historyinspectdiv').addClass('slideleft');
	$('.historyinspectdiv').removeClass('slideright');
	setTimeout(()=>{
		$('.historyinspectdiv').css('display', 'none');
		$('.particularbatchdiv').css('display', 'block');
		$('.particularbatchdiv').addClass('slideright');
		$('.particularbatchdiv').removeClass('slideleft');	
	}, 150);
	const historylistNode = document.querySelector('.historyinspect-studentlist');
	historylistNode.innerHTML = "";
	const datetimeheader = document.querySelector('.historyinspect-datetime');
	datetimeheader.innerHTML = "";
	const historyinspectul = document.querySelector('.historyinspect-ul');
	historyinspectul.innerHTML = "";
	$('.historyinspect-controls').css('display', 'none');
}

// METHOD FOR DELETING ATTENDENCE HISTORY


// METHOD FOR OPENING STUDENT INFO WINDOW
const showstudentinfo = (studentid, showupdatebutton) => {

	loadstudentinfo(studentid, showupdatebutton);
	blur();
	$('.studentinfodiv').css('display', 'block');
	$('.studentinfo').css('display', 'block');
	$('.studentinfo').removeClass('slideleft');
	$('.studentinfo').addClass('slideright');

};

// METHOD FOR LOADING INFORMATION ABOUT STUDENT

let progressbarintervalid;		// variable for progress bar increasing interval function

const loadstudentinfo = (studentid, showupdatebutton) => {
	const studentinfolist = document.querySelector('.studentinfo-ul');
	const updatebutton = document.querySelector('.studentinfo-updatebutton');
	updatebutton.style.display = 'block';
	if(!showupdatebutton){
		updatebutton.style.display = 'none';
	}
	const formdata = new FormData();
	formdata.append('studentid', studentid);
	fetch('/admin/particularbatch/studentinfo', {
		method: 'POST', 
		body: formdata
	}).then(res=>{
		if(res.status != 200){
			throw new Error('student information not fetched !');
		}
		return res.json();
	}).then(result=>{

		if(!result){
			throw new Error('Student information not fetched !');
		}

		document.querySelector('.studentinfo-studentimage').setAttribute('src', `/${result.studentdata.studentimage}`);

		studentinfolist.innerHTML = `<li style="text-transform:capitalize;">Student Name : ${result.studentdata.studentname}</li><li>Student Phone : ${result.studentdata.studentphone}</li><li>Student Guardian : ${result.studentdata.studentguardian}</li><li>Student Admit Date : ${result.studentdata.studentaddtime}</li><li>Student Address : ${result.studentdata.studentaddress}</li>`;
		

		updatebutton.setAttribute('onclick', `openupdatewindow("${result.studentdata._id}")`);
		let presentpercentage = Math.round((result.present/result.totalAttendence) * 100);
		if(presentpercentage>5){
			
			
			
			let text = 0;
			const incre = () => {
				if(text>=presentpercentage){
					clearInterval(progressbarintervalid);
					text = 0;
				} else {
					text++;
					$('.progressbar').css({'width': text+'%'});
					$('.progressbar').text(text+'%');

				}
			}
			setTimeout(()=>{
				 progressbarintervalid = setInterval(incre, 40);
			}, 150);
			
		}
		
	}).catch(err=>console.log(err));

	
};




// METHOD FOR CLOSING STUDENT INFO WINDOW
const closestudentinfo = () =>{
	
	$('.studentinfo').removeClass('slideright');
	$('.studentinfo').addClass('slideleft');
	const studentinfolist = document.querySelector('.studentinfo-ul');
	setTimeout(()=>{
		$('.studentinfo').css('display', 'none');
		$('.studentinfodiv').css('display', 'none');
	}, 250);
	studentinfolist.innerHTML = "";
	$('.progressbar').css({'width': '0%'});
	$('.progressbar').text('0%');
	clearInterval(progressbarintervalid);
	noblur();
}; 
// -----------------------------------------

// method for removing students 
const removestudents = () => {

	if(arrayofpresentstudents.length<=0){
		alert('No student selected !');
		return false;
	}
	$('.removestudent-submit').text('Removing');
	$('.removestudent-submit').addClass('disabled');
	$('.removestudent-submit').prop('disabled', true);
	const formdata = new FormData();
	formdata.append('studentarray', arrayofpresentstudents);
	fetch('/admin/particularbatch/removestudents', {
		method: 'DELETE',
		body: formdata
	}).then(res=>{
		if(res.status != 200){
			throw new Error('Oops! Error :( . Plzz Try Again !');
		}
		return res.json();
	}).then(result=>{
		if(!result){
			throw new Error('Oops! Error :( . Plzz Try Again !');
		}
		setTimeout(()=>{
			alert('Students removed !');
			$('.removestudentwindow-back').click();
		$('.removestudent-submit').removeClass('disabled');
		$('.removestudent-submit').prop('disabled', false);
		$('.removestudent-submit').text('Remove');
		}, 2000);
		
	}).catch(err=>{
			$('.removestudent-submit').removeClass('disabled');
		$('.removestudent-submit').prop('disabled', false);
		$('.removestudent-submit').text('Remove');
		return openerrorpopup(err.message);
	});
};

const resetForm = (form) => {
	const formele = form.children()[2].getElementsByTagName('form');
	const formdetails = formele[0].children[0];
	const sectionArray = formdetails.getElementsByTagName('section');
	for(let i=0;i<sectionArray.length;++i){
		
		// resetting imagesection
		if(sectionArray[i].getAttribute('class').includes("imagesection")){
			const fileinput = sectionArray[i].getElementsByTagName('input')[0];
			let imageele = sectionArray[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0] ? sectionArray[i].getElementsByTagName('div')[0].getElementsByTagName('img')[0] : undefined;
			let labelele = sectionArray[i].getElementsByTagName('div')[0].getElementsByTagName('label')[0] ? sectionArray[i].getElementsByTagName('div')[0].getElementsByTagName('label')[0] : undefined;
			
			if(imageele){
				imageele.style.display = 'none';
				imageele.setAttribute('src', '');
			} 
			if(labelele){
				labelele.innerHTML = 'Choose image';
			}

			if(fileinput){
				fileinput.value = null;
			}
		}
		// resetting formdetails
		if(sectionArray[i].getAttribute('class').includes("formdetails")){
			const formdetails = sectionArray[i].getElementsByTagName('div')[0].getElementsByTagName('div');
			let inputfield;
			for(let k=0;k<formdetails.length;++k){
				inputfield = formdetails[k].getElementsByTagName('input')[0];
				inputfield.value = "";
				$('.'+inputfield.getAttribute('class')).blur();
			}
		}
	}
};

//------------------------- JQUERY 
$('document').ready(()=>{

	$('.userprofile').click(()=>{

		if($('.profilepopupdiv').attr('class') == 'profilepopupdiv'){
			$('.profilepopupdiv').addClass('show');
			setTimeout(()=>{
			$('.profilepopup').addClass('show');
			}, 100);	
		} else {
			$('.profilepopup').removeClass('show');
			setTimeout(()=>{
			$('.profilepopupdiv').removeClass('show');
			}, 100);	
		}

		
	});
	

	

		
	//method for closing profile window
	$('.backimg').click(()=>{
		$('.updateprofilediv').removeClass('show');
		$('.updateprofile').removeClass('show');
		$('.profilepopupdiv').addClass('show');
		noblur();
	});

	
	
	//method for opening update profile picture window
	$('#profile-image').click(()=>{
		$('.profilepicturediv').addClass('show');
		$('.updateprofilediv').addClass('blur');
		setTimeout(()=>{
			$('.profilepicture').addClass('show');
		}, 200);
	})
	// for closing it
	$('.profilepicture-closebutton').click(()=>{
		$('.profilepicturediv').removeClass('show');
		$('.profilepicture').removeClass('show');
		$('.updateprofilediv').removeClass('blur');
		$('.yesimagebutton').addClass('disabled');
		$('.yesimagebutton').prop('disabled', true);
		$('.profilepicture-img').attr('src', $('#profile-image').attr('src'));
		document.querySelector('#imageselect').value = null;
	})
	//-------------------------------------
	
	//METHOD FOR DISPLAYING AND REMOVING MOBILE CONTROLS 

	$('.dashboardcontrolicon').click(()=>{
		$('.mobilecontroldiv').addClass('open');
	});

	$('.mobilecontroldiv-closebutton').click(()=>{
		$('.mobilecontroldiv').removeClass('open');
	})

	//method for createbatch div
		//addition of class
		
		//method for showhide password 
		$('.showhidepasswordimg').click((e)=>{
			console.log(e.target.parentNode.childNodes);
			const inputele = e.target.parentNode.childNodes[5];
			const eyeicon = e.target.parentNode.childNodes[3];
				if(inputele.getAttribute('type') == 'password') {
					inputele.setAttribute('type', 'text');
					eyeicon.setAttribute('src', '/img/icons/showpassword.png');
				} else {
					inputele.setAttribute('type', 'password');
					eyeicon.setAttribute('src', '/img/icons/hidepassword.png');
				}
		});
	//end of this method for createbatchdiv

	//method for displaying create batch window
	$('.createnewbatch-button, .createnewbatch-button2').click(()=>{
	
		$('.createbatchdiv').addClass('show');
		$('.createbatch').addClass('show');
		$('.batchnameinput').focus();
			blur();
	});
	//end of method for displaying create batch window
	//method for closing create batch window
	$('.createbatch-closebutton').click(()=>{
		noblur();
		$('.createbatchdiv').removeClass('show');
		$('.createbatch').removeClass('show');
		resetForm($('.createbatch'));
	});
	//end of method for closing create batch window
	//method for closing dialog box
		$('.dialog-closebutton').click(()=>{
			$('.dialogboxdiv').removeClass('show');
			$('.dialog').removeClass('show');
			$('.batchnamespan').removeClass('spanslideup');
			$('.batchnameinput').val('');
			resetForm($('.dialog'));
			noblur();
		})
	//end of method for closing dialog box
	
	//method for closeing error window
	$('.errorclosebutton').click(()=>{
		$('.errorwindow').slideUp(500);
	})
	// end of method for closeing error window

	// method for opening adding student window
	$('.add-student').click(()=>{
		$('.addstudentdiv').addClass('show');
		$('.addstudent').addClass('show');
		$('.studentnameinput').focus();
		blur();
	});
	// end of opening adding student window

	// method for closing add student window
	$('.addstudent-closebutton').click(()=>{
		$('.addstudent').removeClass('show');
			$('.addstudentdiv').removeClass('show');
		
		$('.showmessagespan').slideUp(100);
		resetForm($('.addstudent'));
		noblur();
	})
	// end of closing add student window

		// METHOD FOR OPENING EDIT BATCH WINDOW 
		$('.edit-batch').click(()=>{
			$('.editbatchdiv').addClass('show');
			$('.editbatch').addClass('show');
			$('.batchnameinput').focus();
			blur();
		});
		// closing edit batch window
		// $('.editbatch-closebutton').click(()=>{
		// 	$('.editbatchdiv').removeClass('show');
		// 	$('.editbatch').removeClass('show');
		// 	noblur();
		// });

		// METHOD FOR OPENING TAKE ATTENDENCE WINDOW 
		$('.take-attendence').click(()=>{
			$('.loadingdiv').css('display', 'block');
			$('.particularbatchdiv').removeClass('slideright');
			 $('.particularbatchdiv').addClass('slideleft');
			setTimeout(()=>{
				$('.particularbatchdiv').css('display', 'none');
				$('.attendencewindowdiv').addClass('show');
				$('.attendencewindow').addClass('slideright');
			}, 150);

			let studentlistNode = document.querySelector('.attendencewindow-studentlist');
			let studentlistFragment = document.createDocumentFragment();	// a fragment
			let studentcardNode;
					
				fetch('/admin/particularbatch/fetchstudent', {
					method: 'POST',
				}).then(result=>{
					if(result.status != 200){
						throw new Error('Students not found!');
					}
					return result.json();
				}).then(studentdata=>{
					if(!studentdata){
						throw new Error('Students not fetched !');
					}
					console.log(studentdata);
					if(!studentdata.students.length>0){
						throw new Error ('No student present !');
					}
					loadedstudentdata = studentdata.students;
					studentdata.students.forEach(data=>{
						studentcardNode = document.createElement('div');
						studentcardNode.setAttribute('class', 'studentcarddiv');
						studentcardNode.innerHTML = `<div class="studentcard" onclick="present(this, 'element');" id="${data._id}"><div class="studentimagediv"><img src="/img/checkicon.png" class="student-checked"><img src="/${data.studentimage}" alt="${data.studentname}(${data.rollno})" class="studentimage"></div><h3 class="studentname">${data.studentname}(${data.rollno})</h3><div class="studentcard-id"><span style="display:none;">${data._id}</span></div></div><div class='studentcard-controls'><button class="student-information" onclick="showstudentinfo('${data._id}', true)">i</button></div>`;
						studentlistFragment.appendChild(studentcardNode);
					});
					console.log(loadedstudentdata);
					setTimeout(()=>{
						$('.loadingdiv').css('display', 'none');
						document.querySelector('.attendencewindow-message').innerHTML = "";
						 studentlistNode.appendChild(studentlistFragment);
					}, 1000);
					
				}).catch(err=>{
					setTimeout(()=>{
						$('.loadingdiv').css('display', 'none');
						document.querySelector('.attendencewindow-message').innerHTML = `<center><strong>${err.message}, please first add student!</strong></center>`;
					}, 1000);
					
				});			
		});

		// METHOD FOR REMOVING TAKE ATTENDENCE WINDOW

		$('.attendencewindow-back').click((e)=>{
			$('.attendencewindow').removeClass('slideright');
			$('.attendencewindow').addClass('slideleft');
			if(arrayofpresentstudents){
				if(arrayofpresentstudents.length>0){
						arrayofpresentstudents = [];
				}
			}
			setTimeout(()=>{
				$('.attendencewindowdiv').removeClass('show');
				$('.particularbatchdiv').css('display', 'block');
				$('.particularbatchdiv').addClass('slideright');
				$('.particularbatchdiv').removeClass('slideleft');				
			}, 250);
			let di = document.querySelector('.attendencewindow-studentlist');
			di.innerHTML = "";
			document.querySelector('.attendencewindow-message').innerHTML = "";
			$('.loadingdiv').removeClass('remove');
			resetSelectAll(e.target.parentNode.parentNode.getElementsByClassName('showselectdiv')[0], 'Select Students');
			
		});


		// METHOD FOR OPENING STUDENT REMOVING WINDOW
		$('.remove-student').click(()=>{
			$('.moremenudiv').click();
			$('.loadingdiv').css('display', 'block');
			$('.particularbatchdiv').removeClass('slideright');
			 $('.particularbatchdiv').addClass('slideleft');
			setTimeout(()=>{
				$('.particularbatchdiv').css('display', 'none');
				$('.removestudentwindowdiv').addClass('show');
				$('.removestudentwindow').addClass('slideright');
			}, 150);


			let studentlistNode = document.querySelector('.removestudentwindow-studentlist');
			let studentlistFragment = document.createDocumentFragment();	// a fragment
			let studentcardNode;
					
				fetch('/admin/particularbatch/fetchstudent', {
					method: 'POST',
				}).then(result=>{
					if(result.status != 200){
						throw new Error('Students not found!');
					}
					return result.json();
				}).then(studentdata=>{
					if(!studentdata){
						throw new Error('Students not fetched !');
					}
					console.log(studentdata);
					if(!studentdata.students.length>0){
						throw new Error ('No student present !');
					}
					loadedstudentdata = studentdata.students;
					studentdata.students.forEach(data=>{
						studentcardNode = document.createElement('div');
						studentcardNode.setAttribute('class', 'studentcarddiv');
						studentcardNode.innerHTML = `<div class="studentcard" onclick="present(this, 'element');" id="${data._id}"><div class="studentimagediv"><img src="/img/checkicon.png" class="student-checked"><img src="/${data.studentimage}" alt="${data.studentname}(${data.rollno})" class="studentimage"></div><h3 class="studentname">${data.studentname}(${data.rollno})</h3><div class="studentcard-id"><span style="display:none;">${data._id}</span></div></div><div class='studentcard-controls'><button class="student-information" onclick="showstudentinfo('${data._id}', true)">i</button></div>`;
						studentlistFragment.appendChild(studentcardNode);
					});
					console.log(loadedstudentdata);
					setTimeout(()=>{
						$('.loadingdiv').css('display', 'none');
						document.querySelector('.removestudentwindow-message').innerHTML = "";
						 studentlistNode.appendChild(studentlistFragment);
					}, 1000);
					
				}).catch(err=>{
					setTimeout(()=>{
						$('.loadingdiv').css('display', 'none');
						document.querySelector('.removestudentwindow-message').innerHTML = `<center><strong>${err.message}, please first add student!</strong></center>`;
					}, 1000);
					
			});

		});

		// METHOD FOR REMOVING STUDENT REMOVING WINDOW
		$('.removestudentwindow-back').click((e)=>{
			$('.removestudentwindow').removeClass('slideright');
			$('.removestudentwindow').addClass('slideleft');
			
			if(arrayofpresentstudents){
				if(arrayofpresentstudents.length>0){
						arrayofpresentstudents = [];
				}
			}

			setTimeout(()=>{
				$('.removestudentwindowdiv').removeClass('show');
				$('.particularbatchdiv').css('display', 'block');
				$('.particularbatchdiv').addClass('slideright');
				$('.particularbatchdiv').removeClass('slideleft');				
			}, 250);

			let di = document.querySelector('.removestudentwindow-studentlist');
			di.innerHTML = "";
			document.querySelector('.removestudentwindow-message').innerHTML = "";
			$('.loadingdiv').removeClass('remove');
			resetSelectAll(e.target.parentNode.parentNode.getElementsByClassName('showselectdiv')[0], 'Select Students');
		});

		// METHOD FOR OPENING CONFIRMATION DIALOG FOR SEND PRESENT STUDENT D
		$('.attendence-submitbutton').click(()=>{
			//-------------------
		});
		// METHOD FOR REMOVING CONFIRMATION DIALOG
		$('.confirmation-cancle').click(()=>{
			$('.confirmationdiv').removeClass('show');
			noblur();
		});
		
	

		// METHOD FOR OPENING ABSENT WINDOW 
		$('.confirmation-yes').click(()=>{
			// removing dialog
			$('.confirmationdiv').removeClass('show');
			noblur();
			// removing attendence window
			$('.attendencewindow').removeClass('slideright');
			$('.attendencewindow').addClass('slideleft');
			setTimeout(()=>{
				$('.attendencewindowdiv').removeClass('show');
				// opening absent window
				$('.absentwindowdiv').addClass('show');
				$('.absentwindow').addClass('slideright');
			}, 250);
			

		});
		// METHOD FOR CLOSING ABSENT WINDOW REOPENING ATTENDENCE WINDOW
		$('.absentwindow-back').click((e)=>{
			// closing absent window
			$('.absentwindow').removeClass('slideright');
			$('.absentwindow').addClass('slideleft');
			setTimeout(()=>{
				$('.attendencewindowdiv').addClass('show');
				$('.attendencewindow').addClass('slideright');
				$('.attendencewindow').removeClass('slideleft');
				$('.absentwindowdiv').removeClass('show');
				document.querySelector('.absentwindow-studentlist').innerHTML = "";
			}, 250);
			resetSelectAll(e.target.parentNode.parentNode.getElementsByClassName('showselectdiv')[0], 'Select Students');
			e.target.parentNode.parentNode.getElementsByClassName('absentwindow-messagebox')[0].setAttribute('class','absentwindow-messagebox');
		});
		setTimeout(()=>{
			disableforwardbackward();
		}, 100);
		
		// METHOD FOR REMOVING PROFILE PASSWORD POP UP
		$('.profilepassword-close').click(()=>{
			$('.profilepassword').removeClass('show');
			setTimeout(()=>{
				$('.profilepassworddiv').removeClass('show');
			}, 100);
			noblur();
			$('.profilepopupdiv').addClass('show');
			resetForm($('.profilepassword'));

		});

		// METHOD FOR REMOVING ERROR POPUP 
		$('.errorbox-close').click(()=>{
			$('.errorboxdiv').removeClass('show');
			$('.errorbox-msg').text('Error Message !');
			noblur();
		});


		// METHODS FOR MORE MENUES -------------
			
			
			
		// --------------------------------------
		//----------------------------------------


		// METHOD FOR OPENING ADD TEACHER WINDOW
		$('.newteacher').click(()=>{
		$('.addstudentdiv').addClass('show');
		$('.addstudent').addClass('show');
		$('.studentnameinput').focus();
		blur();
	});


		// FOR OPENING BATCH DETAILS IN BATCHFORM
		// $('.batchdetailsicon').click(()=>{
		// 	$('.batchdetails').slideToggle(500);
		// 	$('.batchdetailsicon').toggleClass('rotate');
		// });
});

// const toggledetails = (section, icon) => {
// 	$('.'+section).slideToggle(500);
// 	$('.'+icon).toggleClass('rotate');
// };

// --------------- END OF JQUERY


// METHOD FOR DISABLE FORWARD AND BACKWARD BUTTON
const disableforwardbackward = () =>{
	const backwardstackstring = window.sessionStorage.getItem('backwardstack');
	const forwardstackstring = window.sessionStorage.getItem('forwardstack');

	if(backwardstackstring){
		const stack = JSON.parse(backwardstackstring);
		if(stack.stack){
			if(!stack.stack.length>0){
				$('.control-backward').addClass('disabled');
			}
		}  
	} else {
		$('.control-backward').addClass('disabled');
	}

	if(forwardstackstring){
		const stack = JSON.parse(forwardstackstring);
		if(stack.stack){
			if(!stack.stack.length>0){
				$('.control-forward').addClass('disabled');
			}
		}
	} else {
		$('.control-forward').addClass('disabled');
	}
};

// method for showing check icon and filling up array of present students
const present = (card, invokeby) =>{
	const selectdiv = card.parentNode.parentNode.parentNode.getElementsByClassName('showselectdiv')[0];
	selectdiv.setAttribute('class', selectdiv.getAttribute('class').split(' ')[0] + ' show')
	// console.log(card.parentNode);
	let carddiv = card.parentNode;
	let checkimage = card.childNodes[0].childNodes[0];
	let idspan = card.childNodes[2].childNodes[0];
	if(checkimage.getAttribute('class') == 'student-checked'){
		checkimage.setAttribute('class', 'student-checked show');
		carddiv.setAttribute('class', 'studentcarddiv checked');
		if(!arrayofpresentstudents.includes(idspan.innerHTML)){
			 arrayofpresentstudents.push(idspan.innerHTML);
			//console.log(arrayofpresentstudents);
		}		
		// console.log('going to present');
	} else {
		let index = arrayofpresentstudents.indexOf(idspan.innerHTML);	// checking the index of id in array . if present then value of index will non negative
		if(index > -1){
			let result = arrayofpresentstudents.splice(index, 1);	// it removes the element at index  'index' //syntax of splice is splice(index, number of items need to remove, list of item need to add from the index specified)
			// console.log('RESULT' + result);		// it will show the id removed from the array
		}	
		// console.log(arrayofpresentstudents);
		checkimage.setAttribute('class', 'student-checked');
		carddiv.setAttribute('class', 'studentcarddiv');
		// console.log('going to absent');
		
	}
	console.log(arrayofpresentstudents);
	console.log(invokeby)
	const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
	const showcount = selectdiv.getElementsByClassName('showcount')[0];
	if(invokeby == 'element'){	
		const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
		selectallbutton.setAttribute('class', selectallbutton.getAttribute('class').split(' ')[0]);
	}
	showcount.innerHTML = arrayofpresentstudents.length ? arrayofpresentstudents.length: 'Select Students';
	return;
	};

// METHOD for storing data of absent students
let arrayofabsentstudents = [];
const addabsentstudents = (showconfirmpop) =>{
	
	if(loadedstudentdata){
		if(loadedstudentdata.length>0){
			if(arrayofpresentstudents){
				if(arrayofpresentstudents.length>0){
					arrayofabsentstudents = loadedstudentdata.filter(studata=>{
						if(!arrayofpresentstudents.includes(studata._id.toString())){
							return studata;
						}
					});
					if(showconfirmpop){
						blur();
						$('.confirmationdiv').addClass('show');
					}
					
				} else {
					if(showconfirmpop){
						alert('No student selected !');
						return false;
					}
				}
			} else {
				if(showconfirmpop){
					alert('No student Selected !');
					return false;
				}
			}
		} else {
			if(showconfirmpop){
					alert('No student Selected !');
					return false;
				}	
		}
	} else {
			if(showconfirmpop){
					alert('No student Selected !');
					return false;
				}
	}
	console.log(arrayofabsentstudents);
};

// method of loading absent students on the absent window
const loadabsentstudent = () =>{
	
	const studentlist = document.querySelector('.absentwindow-studentlist');
	studentlist.innerHTML = "";
	let fragement = document.createDocumentFragment();
	let studentcardNode;
	if(arrayofabsentstudents){
		if(arrayofabsentstudents.length>0){
			
			arrayofabsentstudents.forEach(data=>{
				studentcardNode = document.createElement('div');
				studentcardNode.setAttribute('class', 'studentcarddiv');
				studentcardNode.innerHTML = `<div class='studentcard' onclick="absenttoemail(this, 'element');"><div class="studentimagediv"><img src="/img/checkicon.png" class="student-checked"><img src="/${data.studentimage}" alt="${data.studentname}" class="studentimage"></div><h3 class="studentname">${data.studentname}(${data.rollno})</h3><div class="studentcard-id"><span style="display:none;">${data._id}</span></div></div><div class='studentcard-controls'><button class="student-information" onclick="showstudentinfo('${data._id}', true)">i</button></div>`;
				fragement.appendChild(studentcardNode);
			});
			studentlist.appendChild(fragement);
		} else {
			studentcardNode = document.createElement('div')
			studentcardNode.innerHTML = "<h4 style='text-align:center;'>No Absent student</h4>";
			studentlist.appendChild(studentcardNode);
		}
	} else {
		studentcardNode = document.createElement('div')
		studentcardNode.innerHTML = "<h4 style='text-align:center;'>No Absent student</h4>";
		studentlist.appendChild(studentcardNode);
	}
};

let absenttoemailarray = [];
// method for filling absent student send email array
const absenttoemail = (card, invokeby) =>{
	const selectdiv = card.parentNode.parentNode.parentNode.getElementsByClassName('showselectdiv')[0];
	selectdiv.setAttribute('class', selectdiv.getAttribute('class').split(' ')[0] + ' show');
	const messagebox = card.parentNode.parentNode.parentNode.getElementsByClassName('absentwindow-messagebox')[0];
	messagebox.setAttribute('class', messagebox.getAttribute('class').split(' ')[0] + ' show');
	let carddiv = card.parentNode;
	let checkimage = card.childNodes[0].childNodes[0];
	let idspan = card.childNodes[2].childNodes[0];
	if(checkimage.getAttribute('class') == 'student-checked'){
		if(!absenttoemailarray.includes(idspan.innerHTML)){
			absenttoemailarray.push(idspan.innerHTML);
			
		}
		checkimage.setAttribute('class', 'student-checked show');
		carddiv.setAttribute('class', 'studentcarddiv checked');

	} else {
		let index = absenttoemailarray.indexOf(idspan.innerHTML);
		if(index>-1){
			absenttoemailarray.splice(index, 1);
		}
		checkimage.setAttribute('class', 'student-checked');
		carddiv.setAttribute('class', 'studentcarddiv');
	}
	console.log(absenttoemailarray);
	const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
	const showcount = selectdiv.getElementsByClassName('showcount')[0];
	if(invokeby == 'element'){	
		const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
		selectallbutton.setAttribute('class', selectallbutton.getAttribute('class').split(' ')[0]);
	}
	showcount.innerHTML = absenttoemailarray.length ? absenttoemailarray.length: 'Select Students';
	return ;
};
//  method for sending ids for present students
const sendStudentids = (sendemail) => {
	if(sendemail){
		if(!absenttoemailarray.length>0){
		alert('No student selected !');
		return false;
		}
	}
	
	$('.confirmation-submitonly').addClass('submitting');
	$('.confirmation-submitonly').text('Submitting');
	$('.confirmation-submitonly').prop('disabled', true);
	$('.confirmation-yes').prop('disabled', true);
	$('.confirmation-yes').addClass('nonworking');
	$('.confirmation-cancle').addClass('nonworking');
	$('.confirmation-cancle').prop('disabled', true);
	if(!sendemail){
		if(!arrayofpresentstudents.length>0){
			alert('No student selected !');
			return false;
		}
	}
		
		const data = new FormData();
		data.append('studentid', arrayofpresentstudents);
		data.append('absentstudent', absenttoemailarray);
		data.append('message', $('.messagebox').val());
		fetch('/admin/particularbatch/sendpresentstudents', {
			method: 'POST',
			body: data
		}).then(res=>{
			if(res.status!=200){
				throw new Error('Attendence failed !');
			}
			return res.json();
		}).then(result=>{
			console.log(result);
			if(!result){
				throw new Error('Error !');
			}
			setTimeout(()=>{
					if(sendemail){
				alert('Attendence Submitted and email sent !')
					} else {
						alert('Attendence Submitted !');
					}
					window.location = '/admin/particularbatch';
			}, 1000);
			
		}).catch(err=>console.log(err));
};

// METHOD FOR OPENING MAIN USER PROFILE WINDOW

const openprofile = () => {
	const passcode = document.querySelector('.profilepasswordinput').value;
	$('.openprofile').val('Opening').prop('disabled', true).css('opacity', '0.4');
	const formdata = new FormData();
	formdata.append('passcode', passcode);
	fetch('/admin/openprofile', {
		method: 'POST',
		body: formdata
	}).then(res=>res.json()).then(result=>{
		console.log(result)
		if(result.status != 200){
			throw new Error(result.message || 'Something went wrong !!!');
		}
		$('.openprofile').val('Open').prop('disabled', false).css('opacity', '1');
		$('.profilepassworddiv').removeClass('show');
		$('.profilepassword').removeClass('show');
		resetForm($('.profilepassword'));
		openprofilewindow();
	}).catch(err=>{
		console.log(err);
		$('.openprofile').val('Open').prop('disabled', false).css('opacity', '1');
		$('.profilepassworddiv').removeClass('show');
		$('.profilepassword').removeClass('show');
		resetForm($('.profilepassword'));
		openerrorpopup(err.message);
	})
};

// METHOD FOR OPENING PROFILE PASSWORD POP 
const openprofilepassword = () => {
	console.log(this);
	$('.profilepassworddiv').addClass('show');
	$('.profilepasswordinput').focus();
	blur();
	setTimeout(()=>{
		$('.profilepassword').addClass('show');
		$('.profilepasswordinput').focus();
	}, 100);
	$('.profilepopupdiv').removeClass('show');
};

// METHOD FOR OPENING USER PROFILE UPDATE WNDOW 
const openprofilewindow = () => {
	$('.updateprofilediv').addClass('show');
		blur();
		setTimeout(()=>{
			$('.updateprofile').addClass('show');
		}, 20);
		
		$('.profilepopupdiv').removeClass('show');
};

// METHOD FOR OPENING ERROR POPUP
const openerrorpopup = (errormessage) => {
	$('.errorboxdiv').addClass('show');
	$('.errorbox-msg').html(errormessage);
	blur();
};


// METHOD FOR LOADING BATCHES FOR BATCHES WINDOW

// METHOD FOR LOADING STUDENTS FOR STUDENTS WINDOW 
const loadstudents = (page) => {
	if(!page){
		page = 0;
	}
	$('.loadingdiv').removeClass('remove');
	document.querySelector('.studcard-more').style.display = 'none';
	const studentlist = document.querySelector('.list');
	const fragment = document.createDocumentFragment();
	const formdata = new FormData();
	formdata.append('page', page);
	fetch('/admin/fetchstudents', {
		method: 'POST', 
		body:formdata
	}).then(res=>{

		if(res.status != 200){
			throw new Error('Students not fetched!');
		}
		return res.json();
	}).then(result=>{
		console.log(result);
		if(!result && !result.data){
			throw new Error('Students not fetched !');
		}
		let studentcard;
		result.data.forEach(student=>{
			studentcard = document.createElement('div');
			studentcard.setAttribute('class', 'card');
			studentcard.innerHTML = `<div class='card-image'><img src="/${student.studentimage}"></div><div class='card-info'>	<p>${student.studentname}</p><p>Contact : ${student.studentphone}</p><p>From : ${student.studentaddress}</p></div>`;
			fragment.appendChild(studentcard);
		});
			setTimeout(()=>{
				if(!result.data.length>0){
					studentlist.innerHTML = '<center><h4>No student found, plzz add students!</h4></center>';
				}
				studentlist.appendChild(fragment);

				$('.loadingdiv').addClass('remove');
				if(result.showmore){
					document.querySelector('.studcard-more').style.display = 'block';
					document.querySelector('.studcard-more').setAttribute('onclick', `loadstudents(${++result.page})`);	
					$('.loadingdiv h3').css({'display':'none'});
				}
				if(!result.showmore){
					document.querySelector('.studcard-more').style.display = 'none';
				}
			}, 2000);
	}).catch(err=>{
		if(err.message == 'Unexpected token P in JSON at position 0') err.message = 'Network Error!'
		openerrorpopup(err.message);
		const center = document.createElement('center');
		center.innerHTML = `<h3>${err.message}</h3>`
		studentlist.appendChild(center);
		$('.loadingdiv').addClass('remove');
		console.log(err);
	});
	
};


// METHOD FOR  LOADING TEACHERS FOR TEACHER'S WINDOW
 



const resetSelectAll = (selectdiv, showcount) => {
	const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
	const showcountp = selectdiv.getElementsByClassName('showcount')[0];
	selectdiv.setAttribute('class', selectdiv.getAttribute('class').split(' ')[0]);
	selectallbutton.setAttribute('class', selectallbutton.getAttribute('class').split(' ')[0]);
	showcount.innerHTML = showcount;
};
	
document.querySelector('body').addEventListener('keypress', (e)=>{
	if(e.keyCode == 2){
		$('.take-attendence').click();
	}
}, false);