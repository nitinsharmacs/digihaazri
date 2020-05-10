define(['jquery', 'underscore', 'backbone', './StudentBoxV'], ($, _, Backbone, StudentBoxV)=>{
	const StudentBoxVs = Backbone.View.extend({
		render: function(){
			const self = this;
			this.model.each(studentinfo => {
				const studentboxv = new StudentBoxV({model: studentinfo});
				self.$el.append(studentboxv.render().$el);
			});
			return this;
		}
	});
	return StudentBoxVs;
});