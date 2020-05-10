define(['./NotificationV'],(NotificationV)=>{
	const NotificationVs = Backbone.View.extend({
		events: {
			'click .notification-header':'open',
			'click .closenotific':'close',
		},
		open: function(){
			this.$('.notification-content').removeClass('remove');
			this.$('.notification-content').addClass('show');
		},
		close: function(){
			this.$('.notification-content').addClass('remove');
			setTimeout(()=>{this.$('.notification-content').removeClass('show')}, 300);
			if(this.model.length<=0) return;
			const formdata = new FormData();
			formdata.append('notif', JSON.stringify(Backbone.notifications));
			fetch(this.model.delUrl, {
				method:'POST',
				body:formdata
			}).then(res=>res.json()).then(result=>{
				console.log(result);
			}).catch(err=>console.log(err));
		},
		render: function(){
			const viewContent = `
				<div class="notification-header">
				<img class='notification-bell-img' src="/img/icons/notification-bell.png">
				<span class='notification-bell-span'>${this.model.length}</span>
				</div>
				<div class='notification-content'>
					<button class='closenotific'></button>
				</div>
			`;
			this.$el.html(viewContent);
			this.model.each(info=>{
				const notiview = new NotificationV({model:info});
				this.$('.notification-content').append(notiview.render().$el);
			});
			if(this.model.length == 0){
				this.$('.notification-content').append('<p class="noti-message">No notification</p>')
			}
			return this;
		}
	});
	return NotificationVs;
});