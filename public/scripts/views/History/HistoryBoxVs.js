define(['jquery', 'underscore', 'backbone', './HistoryBoxV'], ($, _, Backbone, HistoryBoxV)=>{
	const HistoryBoxVs = Backbone.View.extend({
		render:function(){
			const self = this;
			this.model.each(historyboxmodel=>{
				const historyboxv = new HistoryBoxV({model: historyboxmodel});
				self.$el.append(historyboxv.render().$el);
			});
			return this;
		}
	});

	return HistoryBoxVs;
});