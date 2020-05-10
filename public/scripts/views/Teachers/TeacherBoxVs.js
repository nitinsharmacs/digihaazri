define(['jquery', 'underscore', 'backbone', './TeacherBoxV'], ($, _, Backbone, TeacherBoxV)=>{
	const TeacherBoxVs = Backbone.View.extend({
		render: function(){
			const self = this;
			this.model.each(teacherinfo=>{
				const teacherboxv = new TeacherBoxV({model:teacherinfo});
				self.$el.append(teacherboxv.render().$el);
			});
			return this;
		}
	});
	return TeacherBoxVs;
});