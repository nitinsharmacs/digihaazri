define(['../../universal/universal', '../../models/Moremenu/MoreMenuM', '../../collections/Moremenu/MoreMenuC', '../Moremenu/MoreMenuVs'], (Universal, MoreMenuM, MoreMenuC, MoreMenuVs)=>{
		const BatchBoxV = Backbone.View.extend({
			tagName: 'div',
			className:'batchbox',
			events:{
				'click .batchimg':'openbatch',
				'click img.batchbox-more': 'openMore',
				'click .moremenudiv': 'closeMore',
				'click a.openBatchInfo':'openBatchInfo',
			},
			openbatch:function(e){
				opendialog(this.model.get('_id'), this.model.get('batchname'), this.model.get('batchimageurl'));
				$('.moremenudiv').click();
				return false;
			},
			openMore: function(e){
				Universal.openMoreMenu(e)
			},
			closeMore: function(e){
				if(e.target.localName === 'div'){
					Universal.closeMoreMenu(e);
				}
			},	
			openBatchInfo: function(e){
				openBatchInfo(e, this.model);
				$('.moremenudiv').click();
				return false;
			},
			render: function(){
				const moremenuc = new MoreMenuC([new MoreMenuM({itemname:'Open', itemclass:'batchimg'}), new MoreMenuM({itemname:'Batch Info', itemclass:'openBatchInfo'}), new MoreMenuM({itemname:'Visit', itemclass:''}), new MoreMenuM({itemname:'Goto', itemclass:''})]);
				const moremenuvs = new MoreMenuVs({model: moremenuc});

				const boxContent =  `
						<div class='batchbox-header'><img src="/${this.model.get('batchimageurl')}" alt='img' class='batchimg'><h3>${this.model.get('batchname')}</h3></div><div class='batchbox-controls'><img src="/img/icons/more.png" class='batchbox-more'></div>`;
				this.$el.html(boxContent);
				this.$('.batchbox-controls').append(moremenuvs.render().$el);
				return this;
			}
	});	
	return BatchBoxV;
});


