const dependencies = ['../universal/universal','../models/History/HistoryBoxM', '../collections/History/HistoryBoxC', '../views/History/HistoryBoxVs', '../models/Popups/ConfirmationM', '../views/Popups/ConfirmationV', '../Events/Events'];

define(dependencies, (Universal ,HistoryBoxM, HistoryBoxC ,HistoryBoxVs, ConfirmationM, ConfirmationV, Events)=>{

		$('.particularbatch-more').click((e)=>{		
				openMoreMenu(e);
			}); 
		$('.moremenudiv').click((e)=>{
				closeMoreMenu(e)
			})

	let selectedHistoryArray = [];

		let page = 0;
		let sr=0;
		const loadhistory = () => {
		page++;
		$('.loadingdiv').css('display', 'block');
		//$('.particularbatch-loadmore').css('display', 'none');
		const historyboxc = new HistoryBoxC();
		const formdata = new FormData();
		formdata.append('page', page);
		Universal.toServer(historyboxc, 'fetch', {body:formdata}).then(result=>{
			if(result.status != 200){
				throw new Error('Attendence not fetched !');
			}
			console.log(result);
				if(result.data){
					result.data.forEach(historyinfo=>{
						sr++;
						historyboxc.add(new HistoryBoxM({...historyinfo, sr: sr}));
					});
					const historyboxvs = new HistoryBoxVs({el:'.historylist', model: historyboxc});
					$('.loadingdiv').css('display', 'none');
					historyboxvs.render();
					if(result.data.length<=0){
						$('.historylist').html(`<center><h3>No History found</h3></center>`)
					}
					if(result.showmore){
						$('.particularbatch-loadmore').css('display', 'block');
					} else {
						$('.particularbatch-loadmore').css('display', 'none');
					}
				}
		}).catch(err=>{
			console.log(err);
					$('.loadingdiv').css('display', 'none');
				$('.historylist').html(`<center><h3>${err}</h3></center>`);
		})
		 	return false;
		};


		// METHOD FOR OPENING OPENING HISTORYINFO WINDOW

		const openhistory = (id) =>{
		$('.loadingdiv').css('display', 'block');
		const historylistNode = document.querySelector('.historyinspect-studentlist');
		const fragement = document.createDocumentFragment();
		const formdata = new FormData();
		formdata.append('historyid', id);
		fetch('/admin/particularbatch/historydata', {
			method: 'POST', 
			body: formdata
		}).then(res=>{
			if(res.status != 200){
				throw new Error('failed to fetch Students !');
			}
			return res.json();
		}).then(result=>{
			console.log(result);
			// console.log(result);
			if(!result){
				throw new Error('failed to fetch Students');
			}

			if(!result.studentdata.length>0){
				const nostudentcard = document.createElement('div');
				nostudentcard.setAttribute('class', 'nohistory');
				nostudentcard.innerHTML = "<center><h4>No Email/Message was sent ...</h4></center>"
				fragement.appendChild(nostudentcard);
			}
			let studentdatatosend = [];
			result.studentdata.forEach(data=>{
				const historycard = document.createElement('div');
				historycard.setAttribute('class', 'historyinspect-studentcard');
				historycard.innerHTML = `<div class='studcard-image'><img src='/${data.studentimage}'></div><div class='studcard-info'><h4 style="text-transform:capitalize;">${data.studentname}</h4><h4>${data.rollno}</h4>	</div>	<div class='studcard-controls'><button class='student-information' onclick='showstudentinfo("${data._id}", false)'>i</button></div>`;
				studentdatatosend.push({studentname: data.studentname, rollno: data.rollno});
				fragement.appendChild(historycard);
			});
			setTimeout(()=>{
				$('.loadingdiv').css('display', 'none');
				$('.historyinspect-controls').css('display', 'block');
				const datetimeheader = document.querySelector('.historyinspect-datetime');
				datetimeheader.innerHTML = `<h4>${result.historyinfo.date}</h4><h4>${result.historyinfo.time}</h4>`;
				const historyinspectul = document.querySelector('.historyinspect-ul');
				historyinspectul.innerHTML	= `<li>Total Students : ${result.historyinfo.totalStudents}</li><li>Present Students : ${result.historyinfo.presentStudents}</li><li>Absent Students : ${result.historyinfo.absentStudents}</li><li>Email/Message Sent to : </li>`;

				const historydownloadbutton = document.querySelector('.historydownloadbutton');
				historydownloadbutton.setAttribute('onclick', `downloadhistory("${result.historyinfo._id}")`);
				// storing historyinformation
				historyinformation = {...result.historyinfo, studentinfo: studentdatatosend};

				historylistNode.appendChild(fragement);
			}, 1000);
			
		}).catch(err=>{
			console.log(err);
		});

			$('.particularbatchdiv').addClass('slideleft');
			$('.particularbatchdiv').removeClass('slideright');
			setTimeout(()=>{
				$('.historyinspectdiv').css('display', 'block');
					$('.particularbatchdiv').css('display', 'none');
				$('.historyinspectdiv').addClass('slideright');
				$('.historyinspectdiv').removeClass('slideleft');
			}, 250);

	}
 

	// METHOD FOR DETELING ATTENDENCE HISTORY

		const deletehistory = (historyid, controlele) => {
		console.log(controlele);
		let historyToDelete = new Array();
		if(historyid){
			historyToDelete.push(historyid);
		} else {
			historyToDelete = selectedHistoryArray.map(id=>id);
		}
			
		const historylist = document.querySelector('.historylist');
		console.log(historyToDelete)
		// console.log(historylist.childNodes);
		const formdata = new FormData();
		formdata.append('historyids', historyToDelete);
		fetch('/admin/particularbatch/deleteattendencehistory', {
			method: 'POST', 
			body: formdata
		}).then(res=>{
			if(res.status != 201){
				throw new Error('History not found or deleted !');
			}
			return res.json();
		}).then(result=>{
			if(!result){
				throw new Error('History not deleted !')
			}
			console.log(result);

			historyToDelete.forEach(id=>{
				const element = historylist.getElementsByClassName(id)[0];
				element.setAttribute('class', element.getAttribute('class').split(' ')[0]+' '+id+' remove');
				setTimeout(()=>{
					element.style.display = 'none';
					historylist.removeChild(element);
				}, 300);
			console.log(historylist.getElementsByClassName(id)[0].getAttribute('class'));
		});
		selectedHistoryArray = [];
		resetSelectAll(controlele.parentNode.parentNode, 'historylist');

		}).catch(err=>{
			console.log(err);
		});
		console.log(historylist.getElementsByClassName('attendencehistoryboxdiv')[1]);
		if(historylist.getElementsByClassName('attendencehistoryboxdiv').length<=1){
			console.log(historylist.getElementsByClassName('attendencehistoryboxdiv'));
			const infobox = document.createElement('div');
			infobox.setAttribute('class', 'infobox');
			infobox.innerHTML = '<center><h3>No History !</h3></center>';
			historylist.appendChild(infobox);
		}
		return false;
	};



	// METHOD FOR SELECTING HISTORY DIVS

	const selectHistory = (box, invokeby) => {
		const selectdiv = box.parentNode.parentNode.parentNode.getElementsByClassName('showselectdiv')[0];
		selectdiv.setAttribute('class', selectdiv.getAttribute('class').split(' ')[0] + ' show');

		const selectimage = box.getElementsByTagName('div')[0].getElementsByTagName('img')[0];
		const selectidspan = box.getElementsByTagName('div')[0].getElementsByTagName('span')[0];
		if(!selectimage || !selectidspan){
			return ;
		}
		if(!selectimage.getAttribute('class').includes('show')) { 
			selectimage.setAttribute('class', selectimage.getAttribute('class').split(' ')[0]+' show'); 
			if(!selectedHistoryArray.includes(selectidspan.innerHTML)){
				selectedHistoryArray.push(selectidspan.innerHTML);
			}
			// console.log(selectedHistoryArray);
		} else {
			selectimage.setAttribute('class', selectimage.getAttribute('class').split(' ')[0]);
			const index = selectedHistoryArray.indexOf(selectidspan.innerHTML);
			if(index>=0){
				selectedHistoryArray.splice(index, 1);
			}
			//console.log(selectedHistoryArray)
		}

		const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
		const showcount = selectdiv.getElementsByClassName('showcount')[0];
		if(invokeby == 'element'){	
			const selectallbutton = selectdiv.getElementsByClassName('selectallbutton')[0];
			selectallbutton.setAttribute('class', selectallbutton.getAttribute('class').split(' ')[0]);
		}
		showcount.innerHTML = selectedHistoryArray.length ? selectedHistoryArray.length: 'Select';

	};



	// METHOD FOR SELECTING ALL HISTORY BOXES

	const selectAll = (selectEle, listNode, methodtoinvoke) => {
	const listItemsArray = document.querySelector('.'+listNode).children;
	if(!selectEle.getAttribute('class').includes('seticon')){
		selectEle.setAttribute('class', selectEle.getAttribute('class').split(' ')[0]+' seticon');
		// select all unselected items
		for(let i=0;i<listItemsArray.length;++i){
			const itemtopasstofun = listItemsArray[i].children[0];
			const concerndiv = listItemsArray[i].getElementsByTagName('div')[0] ? listItemsArray[i].getElementsByTagName('div')[0].getElementsByTagName('div')[0]:undefined;
				if(concerndiv && !concerndiv.getElementsByTagName('img')[0].getAttribute('class').includes('show')){
					eval(methodtoinvoke)(itemtopasstofun, 'method');
				}
		}
	} else {
		selectEle.setAttribute('class', selectEle.getAttribute('class').split(' ')[0]);
		for(let i=0;i<listItemsArray.length;++i){
			const itemtopasstofun = listItemsArray[i].children[0];
			const concerndiv = listItemsArray[i].getElementsByTagName('div')[0] ? listItemsArray[i].getElementsByTagName('div')[0].getElementsByTagName('div')[0]:undefined;
				if(concerndiv && concerndiv.getElementsByTagName('img')[0].getAttribute('class').includes('show')){
					eval(methodtoinvoke)(itemtopasstofun, 'method');
				}
		}
	}
};

	
	// METHOD FOR REMOVING BATCH
	const deleteBatch = (sure) => {
		$('.moremenudiv').click();
		if(!sure){
			const confirmationm = new ConfirmationM({
				details: 'Are you sure to delete batch? This process is not reversable!',
				method:deleteBatch
			});
			const confirmationv = new ConfirmationV({
				eventBus: eventBus, 
				model: confirmationm
			});
			blur();
			$('.con').append(confirmationv.render().$el);
			return false;
		}
		
		return Universal.toServer('/admin/particularbatch/removebatch', 'delete');
	};

		

	

		// returning logic of module
		return {
			loadhistory: loadhistory,
			openhistory: openhistory,
			deletehistory: deletehistory,
			selectHistory: selectHistory,
			selectAll: selectAll,
			deleteBatch: deleteBatch,
			showmessage: showmessage
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

const fileArea1 = document.querySelector('.batchimagecontrol');

fileArea1.addEventListener('dragover', (e)=>{
	e.preventDefault();	
} , false)

fileArea1.addEventListener('drop', (e)=>{
	e.preventDefault();
	document.getElementById('uploadimageinput').files = e.dataTransfer.files;
	readUrl2(e.dataTransfer, '.batchimage');
	//console.log(e.dataTransfer.files)
	
}, false)