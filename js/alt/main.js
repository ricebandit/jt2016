var _dataURL = "data.data.xml";

var _dataManager;
var _preloader;

var _htmlManager;




$(document).ready(function(){


	loadData(_dataURL);

	Global.setMobile($(window));



    var resizeTimeout;

    $(window).resize(function(){
    	if(resizeTimeout){
    		clearTimeout( resizeTimeout );
    	}

    	resize();
        
        resizeTimeout = setTimeout( setTimeout(resize, 500) );
        
    });
    
    
    resize();
})

function loadData(url){
	_dataManager = new DataManager(url);
	_dataManager.addEventListener(DataManager.LOAD_COMPLETE, loadDataComplete);
}

function loadDataComplete(evt){
	_dataManager.removeEventListener(DataManager.LOAD_COMPLETE, loadDataComplete);

	startPreloader();
}

function startPreloader(){
	_preloader = new Preloader(_dataManager.getAllData());

	_preloader.addEventListener(Preloader.LOAD_COMPLETE, preloadComplete);

	_preloader.addEventListener(Preloader.KILL, killPreloader);
}

function preloadComplete(){
	startSite();
}

function startSite(){
	createHTMLManager();

	showSelectionPage();
}

function createHTMLManager(){

	_htmlManager = new HTMLManager( _dataManager.getAllData(), _dataManager.getHistory() );
	_htmlManager.addEventListener(HTMLManager.PROJECT_SELECTED, function(evt){

		showProjectPage(evt);
	});
}


function showProject(code){
	
	_ballHandler.displayProject( code );
}

function showProjectPage(code){
	_htmlManager.setInfo(code);

	$("#project_page").slideDown();

	_htmlManager.resize();
}

function showSelectionPage(){
	$("#selection").slideDown();
}

function killPreloader(){
	_preloader = null;
	
}

function resize(){

	if(_preloader){
		_preloader.resize();
	}

	$("#canvas_3d img").css({left: ($(window).width() - $("#canvas_3d img").width() ) * .5 });


}