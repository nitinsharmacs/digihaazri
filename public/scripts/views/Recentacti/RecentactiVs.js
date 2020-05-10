define(['./RecentactiV'],(RecentactiV)=>{
	const RecentactiVs = Backbone.View.extend({
		render:function(){
			setTimeout(()=>{
				$('.activityloader').css('display','none');
				this.model.each(model=>{
				const recentactiv = new RecentactiV({model:model});
				this.$el.append(recentactiv.render().$el);
			});
			if(this.model.length<=0)
				this.$el.html('<p class="noti-message">No Recent Activities</p>')
			},2000)
			
			
			return this;
		}
	});
	return RecentactiVs;
});