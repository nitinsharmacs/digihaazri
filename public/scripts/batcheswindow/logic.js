const dependencies = ['../universal/universal','../Events/Events','../models/Batches/BatchBoxM', '../collections/Batches/BatchBoxC', '../views/Batches/BatchBoxV', '../views/Batches/BatchBoxVs', '../models/Infobox/InfoboxM', '../views/Infobox/InfoboxV','../models/Popups/MessageboxM','../views/Popups/MessageboxV'];



define(dependencies,(Universal,Events,BatchBoxM, BatchBoxC, BatchBoxV, BatchBoxVs, InfoboxM, InfoboxV,MessageboxM,MessageboxV)=>{
	let loadedbatches = {};
	// METHOD FOR LOADING BATCHES FOR BATCH WINDOW
		
			const loadbatches = () => {
				$('.loadingdiv').removeClass('remove');
				const batchboxc = new BatchBoxC();
				Universal.toServer(batchboxc, "fetch").then(result=>{
					console.log(result)
					if(!result){
						throw new Error('Batch not Loaded !');
					}
					result.data.forEach(batchinfo=>{
						loadedbatches[batchinfo._id] = {...batchinfo};
						batchboxc.add(new BatchBoxM(batchinfo));
					})
					const batchboxvs = new BatchBoxVs({el:'.batchcontroldiv-content',model: batchboxc});
					setTimeout(()=>{
						$('.loadingdiv').addClass('remove');
						if(result.data.length<=0){
							$('.newcontrol').css('display', 'block');
						}
				 		batchboxvs.render();
					}, 2000);
				}).catch(err=>{
						console.log(err);
						$('.batchcontroldiv-content').html( `<center><h2>${err.message}</h2></center>`);
						$('.loadingdiv').addClass('remove');
						openerrorpopup(err.message);
				});
		};


		const openBatchInfo = (e, model) => {
			let batchinfo = loadedbatches[model.get('_id')];
			const infobox = {
				infoboxHeading:'Batch Info',
				infoboxContent: [
					{label:'Batch Name', value:batchinfo.batchname},
					{label:'Created At', value: batchinfo.createdat},
					{label:'Teacher', value:batchinfo.teachername},
					{label:'Students', value: batchinfo.totalstudents}
				],
				infoboxImage: batchinfo.batchimageurl
			};
			const batchinfom = new InfoboxM(infobox);
			const batchinfov = new InfoboxV({model: batchinfom, bus: eventBus});
			$('body').append(batchinfov.render().$el);
		};

		//method to send forgot batch password 
		const fgtbtchpswd = (batchid) => {
			fetch('/rest/teacher/fgtbtchpswd', {
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify({
					batchid:batchid
				}),
			}).then(res=>res.json()).then(result=>{
				console.log(result)
				if(result.status != 200)
					throw new Error('Mail not sent');
				const messageboxm = new MessageboxM({
					message:'Reset Password Mail has sent.'
				});
				const messageboxv = new MessageboxV({model:messageboxm,el:'.dashboard'});
				messageboxv.render();
			}).catch(err=>{
				console.log(err);
				alert('Mail not sent!');
			});
		};

		// exporting all methods of this module
		return {
			loadbatches: loadbatches,
			openBatchInfo: openBatchInfo,
			fgtprofpswd:Universal.fgtprofpswd,
			fgtbtchpswd:fgtbtchpswd
		};

});



const fileArea = document.querySelector('.batchimagecontrol');

fileArea.addEventListener('dragover', (e)=>{
	e.preventDefault();	
} , false)

fileArea.addEventListener('drop', (e)=>{
	e.preventDefault();
	document.getElementById('uploadimageinput').files = e.dataTransfer.files;
	readUrl2(e.dataTransfer, '.batchimage');
	//console.log(e.dataTransfer.files)
	
}, false)