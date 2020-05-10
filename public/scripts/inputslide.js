$('document').ready(()=>{

	$('input').focusin((e)=>{
		const spanele = e.target.parentNode.getElementsByTagName('span')[0];
		if(spanele && e.target.type != 'button'){
			spanele.setAttribute('class', 'spanslideup');
		}
	});
	$('input').focusout((e)=>{
		const inputele = e.target;
		const spanele = e.target.parentNode.getElementsByTagName('span')[0];
		if(spanele && e.target.type!='button'){
			if(inputele.value == ''){
				spanele.setAttribute('class', '');
			}
		}
	});

	// for checking all input value, if no value then slidedown the input span
	$('input').on('focusin', (e)=>{
		const alldivs = e.target.parentNode.parentNode.getElementsByTagName('div');
		let span;
		for(let i=0;i<alldivs.length;++i){
		//	console.log(alldivs[i].getElementsByTagName('input')[0].value);
			span = alldivs[i].children[0];
			if(alldivs[i].children[1]&&alldivs[i].getElementsByTagName('input')[0]&&alldivs[i].getElementsByTagName('input')[0].value != ''){
				span.setAttribute('class', 'spanslideup');
			}
		}
	});
	$('.toggleimage').click((e)=>{
		console.log(e.target);
		console.log(e.target.parentNode.parentNode);
		$('.'+e.target.getAttribute('class').split(' ')[0]).toggleClass('rotate');
		$('.'+e.target.parentNode.parentNode.getElementsByTagName('div')[0].getAttribute('class')).slideToggle(500);
		let selectedsection;
		for(let i=0;i<this.$('.toggleimage').length;++i){
			if(e.target != this.$('.toggleimage')[i]){
				console.log($('.'+this.$('.toggleimage')[i].getAttribute('class').split(' ')[0]).toggleClass('rotate'));
				console.log($('.'+this.$('.toggleimage')[i].parentNode.parentNode.getElementsByTagName('div')[0].getAttribute('class')).slideToggle(500));
			}
		}
	});

});