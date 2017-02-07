var _dataURL = "data.data.xml";

var _dataManager;
var _preloader;
var _engine;




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
	createEngine();

	
	createDevConsole();
}

function createDevConsole(){
	Global.devConsole = new Console();
}

function createEngine(){
	_engine = new Engine(_dataManager.getAllData(), _dataManager.getHistory());

	_engine.addEventListener(Engine.ENVIRONMENT_READY, stageEnvironmentReady);

	_engine.addEventListener(Engine.ELEMENTS_READY, stageElementsReady);
}

function stageEnvironmentReady(evt){
	_engine.removeEventListener(Engine.ENVIRONMENT_READY, stageEnvironmentReady);
	_preloader.siteEnvironmentReady();
}

function stageElementsReady(evt){
	_engine.removeEventListener(Engine.ELEMENTS_READY, stageElementsReady);
	_preloader.siteReady();
}

function killPreloader(){
	_engine.resize();
	_preloader = null;

	_engine.launch();
	
}

function resize(){
	if(_engine){
    	_engine.resize();
	}

	if(_preloader){
		_preloader.resize();
	}

	if(Global.devConsole){
		Global.devConsole.resize();
	}


}