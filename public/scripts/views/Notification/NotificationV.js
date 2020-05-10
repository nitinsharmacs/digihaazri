define([],()=>{
	const NotificationV = Backbone.View.extend({
		className:'notification',
		events: {
			'click p':'seen'
		},
		seen: function(e){
			if(e.target.classList === 'seen') return ;
			const countbell = e.target.parentNode.parentNode.parentNode.querySelector('.notification-bell-span');
			countbell.innerHTML = +countbell.innerHTML-1;
			Backbone.notifications[this.model.get('id')] = {seen:true,remove:new Date(new Date().setDate(new Date().getDate() + 5))};
			e.target.classList = 'seen';
		},
		render:function(){
			const viewContent = `
					<p>${this.model.get('name')}
					<br>
					<small>${this.model.get('description')}</small>
					</p>
					
			`;
			this.$el.html(viewContent);
			return this;
		}
	});
	return NotificationV;
});