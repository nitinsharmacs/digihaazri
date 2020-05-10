
let openBatchInfo, fgtprofpswd, fgtbtchpswd;
require(['../app','../inputslide' ,'logic'], (app,inputslide, Logic )=>{
	Logic.loadbatches();
	openBatchInfo = Logic.openBatchInfo;
	fgtprofpswd = Logic.fgtprofpswd;
	fgtbtchpswd = Logic.fgtbtchpswd;
});