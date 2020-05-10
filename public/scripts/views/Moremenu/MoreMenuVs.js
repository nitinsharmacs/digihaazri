define(['./MoreMenuV'], (MoreMenuV)=>{
	const MoreMenuVs = Backbone.View.extend({
		className:'moremenudiv',
		render:function(){
			const self = this;
			self.$el.html(`<div class='moremenu'></div>`);
			this.model.each((item)=>{
				const viewContent = new MoreMenuV({model: item});
				self.$('.moremenu').append(viewContent.render().$el)
			});
			return this;
		}
	});
	return MoreMenuVs;
});