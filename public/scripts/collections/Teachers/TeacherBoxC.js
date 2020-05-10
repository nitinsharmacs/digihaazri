define(['jquery', 'underscore', 'backbone', '../../models/Teachers/TeacherBoxM'], ($, _, Backbone, TeacherBoxM)=>{
	const TeacherBoxC = Backbone.Collection.extend({
		url:'/admin/fetchteachers',
		model: TeacherBoxM
	});
	return TeacherBoxC;
});