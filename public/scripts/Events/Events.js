const eventBus = _.extend({}, Backbone.Events);


// events 

// Backbone custom events
	eventBus.on('closeBatchInfo', (infomodel)=>{
		const infomodeldiv = infomodel[0].getElementsByTagName('div')[0]
		infomodeldiv.setAttribute('class', infomodeldiv.getAttribute('class').split(' ')[0]+' remove');
		setTimeout(()=>{
			document.querySelector('body').removeChild(infomodel[0]);
		}, 250);
		
	});

	eventBus.on('removeConfirmation', (ele)=>{
		const confirmation = ele[0].getElementsByTagName('div')[0];
		confirmation.setAttribute('class', confirmation.getAttribute('class').split(' ')[0]+' remove');
		setTimeout(()=>{
			document.getElementById('content').removeChild(ele[0]);
			noblur();
		}, 300);
	});