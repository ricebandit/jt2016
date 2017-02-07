Preloader.prototype = new EventDispatcher();

Preloader.LOAD_COMPLETE = "preloader_loadcomplete";
Preloader.KILL = "preloader_kill";

function Preloader(data){
    var _this = this;
    
    var _data = data;
    
    Global.loadQueue = new createjs.LoadQueue(true);
    
    var _loadManifest = [];



    var _loadMessages = [
        "Loading Assets... ",
        "Building Environment... ",
        "Building Elements... ",
        "Ready?"
        ];

    


    _this.resize = function(){
    }

    _this.siteEnvironmentReady = function(){
        $("#load #load_message .text").html(_loadMessages[2] );
    }
    _this.siteReady = function(){
        $("#load #load_message .text").css({display:"none"});

        $("#load #load_ready").css({display:"block"});

        // DESKTOP/MOUSE
        $("#load #load_ready").on("click", function(evt){

            evt.preventDefault();

            $("#site").css({display:"block", opacity:1});
            
            $("#load").animate({opacity:0}, {duration:1000, complete:function(){
                    kill();

                    $("#load").css({display:"none"});

                    $("#site").css({position:"relative", opacity:1});
                }
            });

            $("#load #load_ready").css({display:"none"});
            $("#load #load_ready").unbind("click");

            _this.dispatchEvent(Preloader.KILL);

        })

    }

    function init(){
        startLoader();   
    }

    function startLoader(){
        $("#load").css({display:"block"});
        $("#load").animate({opacity:1}, {duration:1000, complete:startLoad});
    }


    function startLoad(){
        
        for(var i = 0; i < _data.length; i ++){

            
            var loadObj = new Object();
            loadObj.src = _data[i].img + ".jpg";
            loadObj.id = _data[i].code;

            if(Global.mobile === true || Global.tablet === true){
                loadObj.src = _data[i].img + "_mobile.jpg";
            }
            
            _loadManifest.push(loadObj);
        }
        
        Global.loadQueue.on("complete", loadComplete);
        Global.loadQueue.on("progress", loadProgress);
        
        Global.loadQueue.loadManifest(_loadManifest);

    }
    
    function loadProgress(evt){

        
        var percent100 = Math.round(evt.progress * 100);

        $("#load #load_message .text").html(_loadMessages[0] + percent100 + "%");
        
    }
    
    function loadComplete(){

        $("#load #load_message .text").html(_loadMessages[1] );

        $(Global.loadQueue).unbind("complete");
        $(Global.loadQueue).unbind("progress");

        _this.dispatchEvent(Preloader.LOAD_COMPLETE);

        _this.siteReady();
    }
    
    function kill(){

        _this = null;
    }
    
    init();
    
    return _this;
}