define([], ()=>{
	const MoreMenuV = Backbone.View.extend({
		tagName:'a',
		render: function(){
			this.$el.html(this.model.get('itemname'));
			this.$el.attr('class', this.model.get('itemclass'));
			return this;
		}
	});
	return MoreMenuV;
});