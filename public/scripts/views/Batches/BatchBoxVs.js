define(['./BatchBoxV'], (BatchBoxV)=>{
	const BatchBoxVs = Backbone.View.extend({
		render:function(){
			const self = this;
			this.model.each(batchboxm=>{
				const batchboxv = new BatchBoxV({model: batchboxm});
				self.$el.append(batchboxv.render().$el);
			});
			return this;
		}
	});

	return BatchBoxVs;
});