define(['jquery', 'underscore', 'backbone', '../../universal/universal','../../models/Moremenu/MoreMenuM', '../../collections/Moremenu/MoreMenuC', '../Moremenu/MoreMenuVs'], ($, _, Backbone, Universal, MoreMenuM, MoreMenuC, MoreMenuVs)=>{
	const StudentBoxV = Backbone.View.extend({
		className:'card',
		events: {
			'click img.card-more': 'openMore',
			'click .moremenudiv': 'closeMore',
		},
		openMore: function(e){
				Universal.openMoreMenu(e)
		},
		closeMore: function(e){
			if(e.target.localName === 'div'){
				Universal.closeMoreMenu(e);
			}
		},
		render: function(){

			const moremenuc = new MoreMenuC([new MoreMenuM({itemname:'View', itemclass:''}), new MoreMenuM({itemname:'Remove', itemclass:''})]);
			const moremenuvs = new MoreMenuVs({model: moremenuc});

			const viewContent = `<div class='card-image'><img src="/${this.model.get('studentimage')}"></div><div class='card-info'>	<p>${this.model.get('studentname')}</p><p>Contact : ${this.model.get('studentphone')}</p><p>From : ${this.model.get('studentaddress')}</p></div><div class='card-controls'><img src="/img/icons/more.png" class='card-more'></div>`;
			this.$el.html(viewContent);
			this.$('.card-controls').append(moremenuvs.render().$el);
			return this;
		}	
	});
	return StudentBoxV;
});