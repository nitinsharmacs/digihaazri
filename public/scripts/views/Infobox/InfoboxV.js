define([], ()=>{
	const BatchInfoV = Backbone.View.extend({
		className:'batchinfodiv',
		initialize:function(options){
			this.eventBus = options.bus;
		},
		events: {
			'click img.batchinfo-back':'closeBatchInfo'
		},
		closeBatchInfo: function(){
			this.model.destroy();
			this.eventBus.trigger('closeBatchInfo', this.$el);
		},	
		render:function(){
			console.log(this.model.isValid())
			if(!this.model.isValid()){
				this.$el.html(`<div class='batchinfo'>
					<div class="batchinfo-header">
						<!-- IT would contain header of info model -->
						<img src="/img/icons/traingle.png" class='batchinfo-back'>
						<h3>Error</h3>
					</div>
						<center><h2>Mistake : ${this.model.validationError}</h2></center>
					</div>`);
				return this;
			}
			const viewContent = `
	<div class="batchinfo">
		<div class="batchinfo-header">
			<!-- IT would contain header of info model -->
			<img src="/img/icons/traingle.png" class='batchinfo-back'>
			<h3>${this.model.get('infoboxHeading')}</h3>
		</div>

		<div class="batchinfo-main">
				<div class="batchinfo-contentpart">
					<div class="batchinfo-content">
						
					</div>
					<div class="batchinfo-controls">
						
					</div>
				</div>
				<!-- image part -->
				
		</div>

	</div>
			`;			
			this.$el.html(viewContent);
			this.model.get('infoboxContent').forEach(info=>{
				this.$('.batchinfo-content').append(`<div class="batchinfo-infobox">
							<label>
								${info.label} : 
							</label>
							<p>${info.value}</p>
						</div>`);
			});
			if(this.model.get('infoboxImage')){
				this.$('.batchinfo-main').append(`<div class="batchinfo-imagepart">
					<!-- image section -->
					<img src="/${this.model.get('infoboxImage')}">
				</div>`);
			}
			return this;
		}
	});

	return BatchInfoV;
});