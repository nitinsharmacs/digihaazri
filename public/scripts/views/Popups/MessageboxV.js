define([], ()=>{
	const MessageboxV = Backbone.View.extend({
		render: function(){
			console.log('view rendered');
			const viewContent = `
				<div class="messageboxpopup">
					<p>${this.model.get('message')||'Some Message'}</p>
				</div>
			`;
			this.$el.append(viewContent);
			setTimeout(()=>{
				this.$('.messageboxpopup').remove();
				console.log()
			}, 3000);
		}
	});
	return MessageboxV;
});