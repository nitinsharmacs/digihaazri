define(['jquery', 'underscore', 'backbone'], ($, _, Backbone)=>{
	const HistoryBoxV = Backbone.View.extend({
		tagName:'div',
		className:'attendencehistoryboxdiv',
		events: {
			'click .openhistorybutton': 'openhistory',
			'click .attendencehistorybox': 'selectHistory'
		},
		openhistory:function(){
			openhistory(`${this.model.get('_id')}`);
		},
		selectHistory: function(e){
			console.log(this.model.get('_id'));
			selectHistory(e.target.parentNode.parentNode, 'element');
		},
		render:function(){
			const boxContent = `<div class="attendencehistorybox" ><div class="attendencehistorybox-select"><img class='historyselectimage' src="/img/checkicon.png"><span style="display:none;">${this.model.get('_id')}</span></div><div class='attendencehistorybox-info'><h4>${this.model.get('sr')}</h4><h4>${this.model.get('date')}</h4><h4>${this.model.get('time')}</h4><h4>${this.model.get('present')}</h4></div></div><div class='attendencehistorybox-controls'><div  class='openhistorybutton' ></div><div onclick="return(deletehistory('${[this.model.get('_id')]}', this.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('showselectdiv')[0].getElementsByClassName('deletehistorybutton')[0]))" class='deletehistorybutton' onmouseover="this.setAttribute('class', 'deletehistorybutton change')" onmouseout="this.setAttribute('class', 'deletehistorybutton')"></div></div>`;
			this.$el.html(boxContent);
			this.$el.addClass(this.model.get('_id'));
			return this;
		}
	});
//
	return HistoryBoxV;
});