define(['jquery', 'underscore', 'backbone','../../universal/universal' ,'../../models/Moremenu/MoreMenuM', '../../collections/Moremenu/MoreMenuC', '../Moremenu/MoreMenuVs'], ($, _, Backbone,Universal, MoreMenuM, MoreMenuC, MoreMenuVs)=>{
	const TeacherBoxV = Backbone.View.extend({
		className:'card',
		events: {
			'click img.card-more': 'openMore',
			'click .moremenudiv': 'closeMore',
			'click a.open-teacherinfo': 'openTeacherInfo',
			'click a.remove-teacher':'removeTeacher'
		},
		openMore: function(e){
				Universal.openMoreMenu(e)
		},
		closeMore: function(e){
			if(e.target.localName === 'div'){
				Universal.closeMoreMenu(e);
			}
		},
		removeTeacher: function(e){
			removeTeacher();
		},
		openTeacherInfo: function(e){
			$('.moremenudiv').click();
			openTeacherInfo(e, this.model);
		},
		render:function(){
			const moremenuc = new MoreMenuC([new MoreMenuM({itemname:'Remove', itemclass:'remove-teacher'}), new MoreMenuM({itemname:'Info', itemclass:'open-teacherinfo'})]);
			const moremenuvs = new MoreMenuVs({model:moremenuc});

			const viewContent = `<div class='card-image'><img src="/${this.model.get('teacherimageurl')}"></div><div class='card-info'><p>${this.model.get('teachername')}</p>${this.model.get('teacherphone') ? `<p>Contact : ${this.model.get('teacherphone')}</p>` : ''}${this.model.get('teacheremail') ? `<p style="text-transform:lowerCase"><font style="text-transform:capitalize;">Email</font>: ${this.model.get('teacheremail')}</p>`:''}${this.model.get('teacheraddress') ? `<p>From : ${this.model.get('teacheraddress')}</p>`: ''}</div><div class='card-controls'><img src="/img/icons/more.png" class='card-more'></div>`;
				this.$el.html(viewContent);
				this.$('.card-controls').append(moremenuvs.render().$el);
			return this;
		}
	});
	return TeacherBoxV;
});