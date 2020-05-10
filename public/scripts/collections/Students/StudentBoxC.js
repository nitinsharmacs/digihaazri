define(['jquery', 'underscore', 'backbone', '../../models/Students/StudentBoxM'], ($, _, Backbone, StudentBoxM)=>{
	const StudentBoxC = Backbone.Collection.extend({
		url: '/admin/fetchstudents',
		model: StudentBoxM
	});
	return StudentBoxC;
});