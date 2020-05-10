define([],()=>{
	const ConfirmationV = Backbone.View.extend({
		className: 'confirmationboxdiv1',
		events: {
			'click button.confirmationbox1-yescontrol': 'yesClicked',
			'click button.confirmationbox1-cancelcontrol': 'cancel',
			'click button.close-confirmation':'cancel'
		},
		initialize: function(options){
			this.bus = options.eventBus;
		},
		yesClicked: function(){
				$('.confirmationbox1-yescontrol').prop('disabled', true);
				$('.confirmationbox1-yescontrol').html('<div class="processingloader"></div>');
				$('.processingloadingdiv').css('display', 'block');
			this.model.get('method')(true).then(result=>{
				console.log(result);
				if(!result){
					throw new Error('OOps Error!');
				}
				setTimeout(()=>{
					$('.confirmationbox1-yescontrol').prop('disabled', false);
					window.location='/admin/batch';
				}, 4000);
			}).catch(err=>{	
				console.log(err);
				document.querySelector('.con').removeChild($('.confirmationboxdiv1')[0]);
				openerrorpopup(err.message);
			});
		},
		cancel: function() {
			this.bus.trigger('removeConfirmation', this.$el);
		},
		render: function(){
			const viewContent = `
					<div class='confirmationbox1'>
						<button class='close-confirmation'>X</button>
						<div class='confirmationbox1-header'>
							<img	src='https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png'>
							<h2>Confirmation</h2>
						</div>
						<div class='confirmationbox1-details'>
								<p>${this.model.get('details')}</p>
						</div>
						<div class='confirmationbox1-controls'>
							<button class='confirmationbox1-cancelcontrol'>Cancel</button>
							<button class='confirmationbox1-yescontrol'>Yes, delete it!</button>
						</div>
					</div>
			
			`;
			this.$el.html(viewContent);
			return this;
		}
	});
	return ConfirmationV;
});