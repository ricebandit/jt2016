Engine.prototype = new EventDispatcher();
Engine.ENVIRONMENT_READY = "environemntisready";
Engine.ELEMENTS_READY = "elementsareready";

function Engine(data, history){
	var _this = this;

	var _scene = new THREE.Scene();
	Global.cameraManager;

	var _materialMaker;

	var _htmlManager;

	var _textureLoader = new THREE.TextureLoader();

	var _spotlight;
	var _spotlight2;
	var _hemisphericlight;

	var _skySphere;

	var _patternMaker;
	var _ballHandler;

	var _balls = [];
	var _maxBalls;

	var _ballMats;


	_this.resize = function(){

        Global.cameraManager.resize();

		if(_htmlManager){
			_htmlManager.resize();
		}
	}

	_this.launch = function(){
		// Check for code in URL
		console.log("launch check");

		var deepCode = data[0].code;

		if( getParameterByName('code') ){
			deepCode = getParameterByName('code');
		}

		showProject( deepCode );
	}

	_this.gotoNextProject = function(code){
		showProject(code);
	}


	function init() {
		createHTMLManager();

		createCameraManager();

		createMaterialMaker();

	    createPatternMaker();

	    createBallHandler();

		if(Global.mobile === false){
			addSpotlight();
			addSpotlight2();
		}else{
			addSpotlightMobile();
		}


		addSkySphere();

	}

	function createMaterialMaker(){
		_materialMaker = new ProjectMaterialMaker(data);
	}

	function createCameraManager(){
		Global.cameraManager = new CameraManager(_scene);
	}

	function createBallHandler(){
		_ballHandler = new BallHandler(_scene, _patternMaker, _materialMaker);

		_ballHandler.addEventListener(BallHandler.SHOW_PROJECT_PAGE, showProjectPage);

		_ballHandler.addEventListener(BallHandler.SHOW_SELECTION, showSelectionPage);
	}

	function createHTMLManager(){

		_htmlManager = new HTMLManager( data, history );
		_htmlManager.addEventListener(HTMLManager.PROJECT_SELECTED, function(evt){
			_this.gotoNextProject(evt);
		});
	}

	function createPatternMaker(){
		_patternMaker = new PatternMaker();

	}

	function addSkySphere(){

		_textureLoader.load("images/skysphere.jpg",
			function(texture1){

				var sphereFaces = 20;


				var skyGeom = new THREE.SphereGeometry(2500, sphereFaces, sphereFaces);

				var uniforms = {
					texture: {type:"t", value: texture1}
				}

				var material = new THREE.ShaderMaterial({
					uniforms:uniforms,
					vertexShader: document.getElementById("sky-vertex").textContent,
					fragmentShader: document.getElementById("sky-fragment").textContent
				});

				_skySphere = new THREE.Mesh(skyGeom, material);
				_skySphere.scale.set(-1, 1, 1);
				_skySphere.renderOrder = 1000.0;
				_scene.add(_skySphere);

				_this.dispatchEvent(Engine.ENVIRONMENT_READY);

				addElements();
			})
	}

	function addSpotlight(){
	    _spotlight = new THREE.SpotLight( 0xFFFFFF, 1, 4000, Global.degreesToRadians(20), 0.05 );
	    _spotlight.position.set( 0, 1500, 50 );
	    
	    _spotlight.shadow.camera.far = 2500;
 
	    _spotlight.shadow.mapSize.width = 2000;
	    _spotlight.shadow.mapSize.height = 2000;

	    _spotlight.castShadow = true;



	    _scene.add( _spotlight );
	}

	function addSpotlight2(){
	    _spotlight2 = new THREE.SpotLight( 0xFFFFFF, 0.5, 8500, Global.degreesToRadians(90), 0 );
	    _spotlight2.position.set( 0, 1500, 50 );
	    
	    _spotlight2.shadow.camera.far = 5000;
 
	    _spotlight2.shadow.mapSize.width = 2000;
	    _spotlight2.shadow.mapSize.height = 2000;

	    _spotlight2.castShadow = true;



	    _scene.add( _spotlight2 );
	}

	function addSpotlightMobile(){
	    _spotlight2 = new THREE.SpotLight( 0xFFFFFF, 0.5, 8500, Global.degreesToRadians(90), 0 );
	    _spotlight2.position.set( 0, 1500, 50 );

	    
	    _spotlight2.shadow.camera.far = 5000;
 
	    _spotlight2.shadow.mapSize.width = 2000;
	    _spotlight2.shadow.mapSize.height = 2000;

	    _spotlight2.castShadow = true;



	    _scene.add( _spotlight2 );
	}

	function addElements(){

		

		_textureLoader.load("images/floor_tile.jpg",
			function(texture1){
				texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
				texture1.repeat.set(10, 10);


				_textureLoader.load("images/floor_bump.jpg", function(texture2){
					texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
					texture2.repeat.set(4, 4);

					var planeMaterial;

					if(Global.mobile === false && Global.tablet === false){
						planeMaterial = new THREE.MeshPhongMaterial( { 
							map: texture1,
							bumpMap:texture2,
							bumpScale:3,
							shininess:3,
							emissive: new THREE.Color("rgb(8,8,8)"),
							specular: new THREE.Color("rgb(100,100,100)"),
						 } );
					}else{
						planeMaterial = new THREE.MeshPhongMaterial({
							color:"#666666",
							map: texture1,
							bumpMap:texture2,
							bumpScale:3,
							emissive: new THREE.Color("rgb(10,10,10)"),
						})

					}



					var planeGeom = new THREE.PlaneGeometry( 5000, 5000 );

				    var plane = new THREE.Mesh( planeGeom, planeMaterial );
				    plane.receiveShadow = true;

				    _scene.add( plane );

				    plane.rotation.x = Global.degreesToRadians(-90);
				    plane.position.set( 0, 0, 0 );
				})

				
		})

		

	    // Define max ball number
	    _maxBalls = _patternMaker.getMaxNumber();

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
						opacity:0.2
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
                        opacity:0.3
                    })

                    _ballMats = [ballTexture, ballColorTexture, ballColorHighlightTexture];

					loadProjectMaterials();
				})
	    	})
	    })
	    
	}

	function loadProjectMaterials(){

		_materialMaker.addEventListener(ProjectMaterialMaker.MATERIALS_COMPLETE, loadProjectMaterialsComplete);
		_materialMaker.startLoading();

	}

	function loadProjectMaterialsComplete(){
		_materialMaker.removeEventListener(ProjectMaterialMaker.MATERIALS_COMPLETE, loadProjectMaterialsComplete);
		createAllBalls(_ballMats[0], _ballMats[1], _ballMats[2]);
	}

	function createAllBalls(ballTexture, ballColorTexture, ballColorHighlightTexture){

	    // Create Balls
	    for(var i = 0; i < _maxBalls; i++){
	    	createBall( i, ballTexture, ballColorTexture, ballColorHighlightTexture);
	    }
	}

	var _ballCreateCount = 0;

	function createBall(id, ballTexture, ballColorTexture, ballColorHighlightTexture){
		var ball = new Ball(id, ballTexture, ballColorTexture, ballColorHighlightTexture, createBallComplete);

		_balls.push(ball);
	}

	function createBallComplete(evt){
		_ballCreateCount ++;


		if(_ballCreateCount == _maxBalls){

			_ballHandler.setBallsData(_balls);

			

			_this.dispatchEvent(Engine.ELEMENTS_READY);

			
		}
	}

	function showProject(code){
		if(code != "jeremytani"){
			_htmlManager.setInfo(code);
		}
		
		_ballHandler.displayProject( code );
	}

	function showProjectPage(data){
		//$("#project_page").slideDown();

		_htmlManager.showPage("project_page");

		_htmlManager.resize();
	}

	function showSelectionPage(data){
		//$("#selection").slideDown();

		_htmlManager.showPage("selection");
	}

	function animate() {

	    requestAnimationFrame(animate);

	    if(_ballHandler){
	    	_ballHandler.render();
	    }

	    if(Global.cameraManager){
	    	Global.cameraManager.render();
	    }
	}

	function getParameterByName(name, url) {
	    if (!url) {
	      url = window.location.href;
	    }
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';

	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	init();
	animate();
	return _this;
}