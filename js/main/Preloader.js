Preloader.prototype = new EventDispatcher();

Preloader.LOAD_COMPLETE = "preloader_loadcomplete";
Preloader.KILL = "preloader_kill";

function Preloader(data){
    var _this = this;
    
    var _data = data;
    
    Global.loadQueue = new createjs.LoadQueue(true);
    
    var _loadManifest = [];


    var _scene = new THREE.Scene();
    var _camera = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
    var _renderer = new THREE.WebGLRenderer();

    var _textureLoader = new THREE.TextureLoader();

    var _spotlight;
    var _spotlight2;

    var _ball;



    var _loadMessages = [
        "Loading Assets... ",
        "Building Environment... ",
        "Building Elements... ",
        "Ready?"
        ];

    


    _this.resize = function(){

        $("#load canvas").attr("width", $("#load").width());
        $("#load canvas").attr("height", $("#load").height());

        $("#load canvas").css({width:$("#load").width(), height:$("#load").height()});
        
        _renderer.setSize($("#load").width(), $("#load").height() );
        
        _camera.aspect = ($("#load").width()) / $("#load").height();
        
        _camera.updateProjectionMatrix();
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

        $("#canvas_3d").css({display:"block"});
    }

    function init(){

        build3D();
        
    }




/* ------------------------------------------------
3D BEGIN
--------------------------------------------------- */
    function build3D(){


        _camera.position.z = 30;
        _camera.position.y = 10;

        

        
        _renderer.setSize($("#load").width(), $("#load").height());
        _renderer.shadowMap.enabled = true;
        _renderer.setClearColor(new THREE.Color(0x000000) );


        addElements();

        addSpotlight();

        if(Global.mobile == false){
            addSpotlight2();
        }
        

        $("#load")[0].appendChild(_renderer.domElement);
        
    }

    function addSpotlight(){
        _spotlight = new THREE.SpotLight( 0xFFFFFF, 5, 58, Global.degreesToRadians(45), 0.15 );
        _spotlight.position.set( 0, 50, 0 );

        
        _spotlight.shadow.camera.far = 100;

        _spotlight.shadow.mapSize.width = 500;
        _spotlight.shadow.mapSize.height = 500;

        _spotlight.castShadow = true;



        _scene.add( _spotlight );

    }

    function addSpotlight2(){
        _spotlight2 = new THREE.SpotLight( 0xFFFFFF, 2.5, 58, Global.degreesToRadians(30), 0.15 );
        _spotlight2.position.set( 0, 50, 0 );

        
        _spotlight2.shadow.camera.far = 100;

        _spotlight2.shadow.mapSize.width = 500;
        _spotlight2.shadow.mapSize.height = 500;

        _spotlight2.castShadow = true;


        //_scene.add( _spotlight2 );

    }

    function addElements(){

        

        _textureLoader.load("images/floor_tile.jpg",
            function(texture1){


                _textureLoader.load("images/floor_bump.jpg", function(texture2){

                    var planeMaterial = new THREE.MeshPhongMaterial( { 
                        map: texture1,
                        color:0x000000,
                        bumpMap:texture2,
                        bumpScale:1,
                        shininess:20,
                        emissive: new THREE.Color("rgb(0,0,0)"),
                        specular: new THREE.Color("rgb(50,50,50)"),
                     } );

                    var planeGeom = new THREE.PlaneGeometry( 50, 50 );

                    var plane = new THREE.Mesh( planeGeom, planeMaterial );
                    plane.receiveShadow = true;

                    _scene.add( plane );

                    plane.rotation.x = Global.degreesToRadians(-90);
                    plane.position.set( 0, 0, 0 );
                })

                
        })

        // Load Ball textures first
        var ballTexture;
        var ballTextureBump;
        var ballColorTexture;
        var ballColorHighlightTexture;

        _textureLoader.load("images/ball_texture.png", function(textureBall){
            _textureLoader.load("images/ball_texture_bump.jpg", function(textureBallBump){
                _textureLoader.load("images/ball_color_tile.png", function(textureBallColor){

                    ballTexture = new THREE.MeshBasicMaterial({
                        color:0xffffff,
                        map:textureBall,
                        transparent:true,
                        opacity:0.25
                    })

                    ballTextureBump = new THREE.MeshPhongMaterial({
                        map:textureBall,
                        bumpMap:textureBallBump,
                        bumpScale:1.5,
                        shininess:100,
                        emissive: new THREE.Color("rgb(15,15,15)"),
                        specular: new THREE.Color("rgb(200,200,200)"),
                        transparent:true,
                        opacity:0.25

                    })

                    ballColorTexture = new THREE.MeshBasicMaterial({
                        color:0xffffff,
                        map:textureBallColor,
                        transparent:true,
                        opacity:1
                    })

                    ballColorHighlightTexture = new THREE.MeshBasicMaterial({
                        color:0xffffff,
                        map:textureBallColor,
                        transparent:true,
                        opacity:1
                    })

                    /*
                    ballSignatureBump = new THREE.MeshPhongMaterial({
                        map:textureBall,
                        bumpMap:signature,
                        bumpScale:5,
                        shininess:100,
                        emissive: new THREE.Color("rgb(15,15,15)"),
                        specular: new THREE.Color("rgb(200,200,200)"),
                        transparent:true,
                        opacity:1

                    })
                    */

                    createBall(ballTexture, ballTextureBump, ballColorTexture, ballColorHighlightTexture);
                
                })
            })
        })
        
    }


    function createBall(ballTexture, ballTextureBump, ballColorTexture, ballColorHighlightTexture, ballSignatureBump){
        _ball = new LoaderBall(_camera, ballTexture, ballTextureBump, ballColorTexture, ballColorHighlightTexture, ballSignatureBump, startLoader);

        var ballObj = _ball.getObject();
        ballObj.position.y = _ball.getSize() * 0.5;

        _scene.add(ballObj );

        _camera.lookAt( ballObj.position );
    }

    function startLoader(evt){
        $("#load").css({display:"block"});
        $("#load").animate({opacity:1}, {duration:1000, complete:startLoad});
    }

    function renderFrame() {

        requestAnimationFrame(renderFrame);

        if(_ball){
            _ball.onRender();
        }
        
        if(_renderer){
            _renderer.render(_scene, _camera);
        }
    }


    function kill3D(){
        var ballObj = _ball.getObject();
        _scene.remove(ballObj);

        _ball.kill();

        _scene.remove(_spotlight);
        _spotlight = null;

        if(Global.mobile == false){
            _scene.remove(_spotlight2);
            _spotlight2 = null;
        }
    
        _data = null;

        v_scene = null;

        _scene.remove(_camera);
        _camera = null;
        _renderer = null;

        _textureLoader = null;

        _spotlight = null;
        _spotlight2 = null;

        _ball = null;

        _loadMessages = null;

        _scene = null;

        renderFrame = function(){};


    }
/* ------------------------------------------------
3D END
--------------------------------------------------- */




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
    }
    
    function kill(){
        kill3D();

        _this = null;
    }
    
    init();
    renderFrame();
    
    return _this;
}