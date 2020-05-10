define([],()=>{
	const RecentactiV = Backbone.View.extend({
		className:'recent-activity-box',
		events:{
			'click .clear-activity':'clearActivity',
		},
		clearActivity: function(){
			this.$el.addClass('remove');
			setTimeout(()=>{this.$el.remove()},170);
			const formdata = new FormData();
			formdata.append('id',this.model.get('id'));
			fetch(this.model.delUrl,{
				method:'POST',
				body: formdata
			}).then(res=>res.json()).then(result=>{
				console.log(result);
			}).catch(err=>{
				console.log(err);
			})
			return false;
		},
		render:function(){
			const viewContent = `
						<h3>${this.model.get('name')}</h3>
						<div class='recent-activity-boxinfo'>
							<small>${this.model.get('date')}</small>
							<p for='description'>${this.model.get('description')}</p>
						</div>
						<div class='recent-activity-boxcontrols'>
							<button class="clear-activity">clear</button>
						</div>
			`;
			this.$el.html(viewContent);
			return this;
		}
	});
	return RecentactiV;
});