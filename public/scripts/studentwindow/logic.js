define(['jquery', 'underscore', 'backbone', '../universal/universal', '../models/Students/StudentBoxM', '../collections/Students/StudentBoxC', '../views/Students/StudentBoxVs'], ($, _, Backbone, Universal ,StudentBoxM, StudentBoxC, StudentBoxVs)=>{

	// METHOD FOR LOADING STUDENTS
	const loadStudents = (page) => {
		if(!page){
			page = 0;
		}
		$('.loadingdiv').removeClass('remove');
		document.querySelector('.studcard-more').style.display = 'none';
		const formdata = new FormData();
		formdata.append('page', page);
		const studentboxc = new StudentBoxC();
	
		Universal.toServer(studentboxc, 'fetch', {body: formdata}).then(result=>{
			if(!result){
				throw new Error('Students not Fetched!');
			}
			$('.loadingdiv').addClass('remove');
			if(result.data.length<=0){
				$('.list').html(`<center><h4>No student found, plzz add students!</h4></center>`);
			}
			result.data.forEach(studinfo=>{
				studentboxc.add(new StudentBoxM(studinfo));
			});
			const studentboxvs = new StudentBoxVs({el:'.list',model: studentboxc});
			studentboxvs.render();
			if(result.showmore){
				document.querySelector('.studcard-more').style.display = 'block';
				document.querySelector('.studcard-more').setAttribute('onclick', `loadStudents(${++result.page})`);	
				$('.loadingdiv h3').css({'display':'none'});
			}
		}).catch(err=>{
			if(err.message == 'Unexpected token P in JSON at position 0') err.message = 'Network Error!'
			openerrorpopup(err.message);
			$('.list').html(`<center><h4>No student found, plzz add students!</h4></center>`);
			$('.loadingdiv').addClass('remove');
			console.log(err);
		});
		return false;
	};

	// methods to return from module
	return {
		loadStudents: loadStudents,
		fgtprofpswd:Universal.fgtprofpswd
	}
});