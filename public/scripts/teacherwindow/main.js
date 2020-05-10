require.config({
	paths:{
		jquery:'../lib/jquery-min',
		underscore:'../lib/underscore-min',
		backbone:'../lib/backbone-min'
	}
});

let loadteachers, openTeacherInfo, removeTeacher,fgtprofpswd;
require(['../app','../inputslide','./logic'], (App, inputslide,Logic)=>{
	loadteachers = Logic.loadteachers;
	openTeacherInfo = Logic.openTeacherInfo;
	removeTeacher = Logic.removeTeacher;
	fgtprofpswd = Logic.fgtprofpswd
	loadteachers();
});