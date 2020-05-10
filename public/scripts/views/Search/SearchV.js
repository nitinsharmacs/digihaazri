define([],()=>{
	const SearchV = Backbone.View.extend({
		events: {
			'click .searchicon':'opensearch',
			'click .searchclose':'closesearch',
			'keypress .searchcomcontent input[type="search"]':'search',
			'click .searchbutton':'search',
		},
		opensearch: function(e){		
			this.$('.searchcom').removeClass('remove');
			this.$('.searchcom').addClass('show');
			this.$('.searchcomcontent input[type="search"]').focus();
		},
		closesearch: function(e){
			this.$('.searchcom').addClass('remove');
			setTimeout(()=>{this.$('.searchcom').removeClass('show');},300);
			
		},	
		search:function(e){
			if(e.type=='keypress' && e.keyCode != 13) return;
			alert('searching....');
		},
		render: function(){
			console.log('hellow')
			const viewContext = `
				<img class='searchicon' src="/img/icons/searchIcon.png">
				<div class='searchcom' >
					<div class='searchcomheader'>
						<button class='searchclose'></button>
					</div>

					<div class='searchcomcontent'>
						<input type='search' placeholder='Search'/>
					<button class='searchbutton'></button>
					</div>

					<div class='searchcomresult'>
							
					</div>
					
				</div>
			`;
			this.$el.html(viewContext);
			return this;
		}
	});
	return SearchV;
});