require.config({
	paths:{
		jquery:'../lib/jquery-min',
		underscore:'../lib/underscore-min',
		backbone:'../lib/backbone-min'
	}
});

let loadhistory, openhistory, deletehistory, selectHistory, selectAll, openMoreMenu, deleteBatch, showmessage;
require(['../universal/universal', '../app', '../inputslide', 'logic'], (Universal ,App, inputslide, Logic)=>{
	 loadhistory = Logic.loadhistory;
	 openhistory = Logic.openhistory;
	 deletehistory = Logic.deletehistory;
	 selectHistory = Logic.selectHistory;
	 selectAll = Logic.selectAll;
	 openMoreMenu = Universal.openMoreMenu;
	 closeMoreMenu = Universal.closeMoreMenu;
	 deleteBatch = Logic.deleteBatch;
	 showmessage = Logic.showmessage;
	loadhistory();
});
