let fgtprofpswd;
require(['../app','../inputslide','logic'],(app,inputslide,Logic)=>{
	Logic.loadRecentActivities();
	fgtprofpswd = Logic.fgtprofpswd;
});