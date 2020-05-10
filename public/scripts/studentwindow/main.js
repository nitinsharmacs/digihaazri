require.config({
	paths: {
		jquery:'../lib/jquery-min',
		underscore:'../lib/underscore-min',
		backbone:'../lib/backbone-min'
	}
});
let loadStudents,fgtprofpswd;
require(['../lib/jquery-min', '../app','../inputslide' ,'./logic'], ($, App, Inputslide, Logic)=>{
	loadStudents = Logic.loadStudents;
	loadStudents();
	fgtprofpswd = Logic.fgtprofpswd;
});