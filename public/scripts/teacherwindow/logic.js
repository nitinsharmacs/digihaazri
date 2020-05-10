const dependencies = ['../universal/universal','../Events/Events','../models/Teachers/TeacherBoxM' ,'../collections/Teachers/TeacherBoxC', '../views/Teachers/TeacherBoxVs', '../models/Infobox/InfoboxM', '../views/Infobox/InfoboxV', '../models/Popups/ConfirmationM', '../views/Popups/ConfirmationV'];

define(dependencies, (Universal,Events, TeacherBoxM, TeacherBoxC, TeacherBoxVs, InfoboxM, InfoboxV, ConfirmationM, ConfirmationV)=>{
		let loadedTeachers = {};
	const loadteachers = () => {
		$('.loadingdiv').removeClass('remove');
		const teacherboxc = new TeacherBoxC();
		Universal.toServer(teacherboxc, 'fetch').then(result=>{
			result.data.forEach(teacher=>{
				teacherboxc.add(new TeacherBoxM(teacher));
				loadedTeachers[teacher._id] = {...teacher};
			})
			setTimeout(()=>{
				if(result.data.length>0){
						const teacherboxvs = new TeacherBoxVs({el: '.list',model: teacherboxc});
						teacherboxvs.render();
				} else {
					document.querySelector('.newcontrol').style.display = 'block';
				}
				$('.loadingdiv').addClass('remove');
			}, 2000);
			
		}).catch(err=>{
			console.log(err);
			if(err.message == 'Unexpected token P in JSON at position 0') err.message = 'Network Error!';
			$('.loadingdiv').addClass('remove');
			openerrorpopup(err.message);
			$('.list').html(`<center><h3>${err.message}</h3></center>`); 
		});
	};

	// METHOD FOR OPENING TEACHERINFO BOX

		const openTeacherInfo = (e, model) => {
			const teacherinfo = loadedTeachers[model.get('_id')];
			const infobox = {
				infoboxHeading: 'Teacher Info',
				infoboxContent: [
					{label: 'Name', value: teacherinfo.teachername},
					{label: 'Contact', value: teacherinfo.teacherphone},
					{label:'Email', value:teacherinfo.teacheremail},
					{label:'From', value: teacherinfo.teacheraddress},
					{label: 'Joined', value: teacherinfo.addedat}
				],
				infoboxImage: teacherinfo.teacherimageurl,
			};
			const infoboxm = new InfoboxM(infobox);
			const infoboxv = new InfoboxV({model: infoboxm, bus: eventBus});
			$('body').append(infoboxv.render().$el);
		}

		// METHOD FOR REMOVING TEACHER
		const removeTeacher = (sure) => {

			$('.moremenudiv').click();
			if(!sure){
				const confirmationm = new ConfirmationM({
					details: 'Are you sure to remove Teacher? This process is not reversable!',
					method: removeTeacher
				});
				const confirmationv = new ConfirmationV({eventBus: eventBus, model: confirmationm});
				$('.con').append(confirmationv.render().$el);
				blur();
				return false;
			}

			console.log('REMOVING');
			return Promise.reject({message:'Sorry, Teacher cannot be removed now &#128513;'});
			// return Universal.toServer('/admin/particularbatch/removebatch', 'delete');
		};

	
	// returning all methods from this module
	return {
		loadteachers: loadteachers,
		openTeacherInfo: openTeacherInfo,
		removeTeacher: removeTeacher,
		fgtprofpswd:Universal.fgtprofpswd
	};
});



const fileArea = document.querySelector('.studentimagecontrol');

fileArea.addEventListener('dragover', (e)=>{
	e.preventDefault();
} , false)

fileArea.addEventListener('drop', (e)=>{
	e.preventDefault();
	document.getElementById('studentuploadimageinput').files = e.dataTransfer.files;
	readUrl2(e.dataTransfer, '.addstudimage');
	console.log(e.dataTransfer.files)
}, false)