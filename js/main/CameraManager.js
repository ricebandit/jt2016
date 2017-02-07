function CameraManager(_scene){
	
	var _this = this;

	var _camera = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraFollow = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraRevolverCeiling = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraRevolverGround = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraEastSettleTop = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraSlideWest = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraSlideEast = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraSlideUpSettle = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );
	var _cameraZoomOutSouth = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 1, 6000 );

	var _renderer = new THREE.WebGLRenderer();

	Global.activeCamera = _camera;

	Global.ballLookAt = new THREE.Vector3(0, 0, 0);
	Global.camLookAt = new THREE.Vector3(0, 0, 0);

	var _revolverCeilingTarget = new THREE.Object3D();
	var _revolverGroundTarget = new THREE.Object3D();
	var _revolverCeilingTargetContainer = new THREE.Object3D();
	var _revolverGroundTargetContainer = new THREE.Object3D();

	var _camData;

	var _devCams;
	var _devCamDist = 300;


	_this.resize = function(){
        $("#canvas_3d canvas").attr("width", $(window).width() + 10);
        $("#canvas_3d canvas").attr("height", $(window).height());

        $("#canvas_3d canvas").css({width:$(window).width(), height:$(window).height()});
        
        _renderer.setSize($(window).width(), $(window).height() );
        
        Global.activeCamera.aspect = ($(window).width()) / $(window).height();
        
        Global.activeCamera.updateProjectionMatrix();



        updateRender();
	}

	_this.render = function(){

	    var cameraMode;

        switch(Global.devCamActive){
            case 1:
            	Global.activeCamera = _devCams[0];

            	cameraMode = "X CAM";
            	Global.devConsole.switchCamera(cameraMode);
            break;
            case 2:
            	Global.activeCamera = _devCams[1];

            	cameraMode = "Y CAM";
            	Global.devConsole.switchCamera(cameraMode);
            break;
            case 3:
            	Global.activeCamera = _devCams[2];

            	cameraMode = "Z CAM";
            	Global.devConsole.switchCamera(cameraMode);
            break;
        }

        if(Global.activeCamera === _camera){
        	updateDefaultCam();
        }

        if(Global.activeCamera === _cameraFollow){
        	updateFollowCam();
        }

        if(Global.activeCamera === _cameraRevolverCeiling){
        	updateRevolverCeilingCam();
        }

        if(Global.activeCamera === _cameraRevolverGround){
        	updateRevolverGroundCam();
        }

        if(Global.activeCamera === _cameraEastSettleTop){
        	updateEastSettleTop();
        }

        if(Global.activeCamera === _cameraSlideWest){
        	updateSlideWest();
        }

        if(Global.activeCamera === _cameraSlideEast){
        	updateSlideEast();
        }

        if(Global.activeCamera === _cameraSlideUpSettle){
        	updateSlideUpSettle();
        }

        if(Global.activeCamera === _cameraZoomOutSouth){
        	updateZoomOutSouth();
        }

	    if(_renderer){
	    	_renderer.render(_scene, Global.activeCamera);
		}

	}

	_this.switchCamera = function(id, data){
		//console.log("switchCamera", id);

		// CLEAN UP/REVERT STATUS BACK BEFORE PROCEEDING
		if(Global.activeCamera === _cameraFollow){
			_camData.obj.showElementsForCamera();
		}


		_camData = data;

		if(data == undefined){
			_camData = null;
		}



		switch(id){
			case "follow":
				Global.ballLookAt = _camData.obj.getObject().position;

				followCamStart();
				
			break;
			case "revolverCeiling":
				restartRevolverCeiling();
				Global.ballLookAt = _cameraRevolverCeiling.position;

				Global.activeCamera = _cameraRevolverCeiling;
			break;
			case "revolverGround":
				restartRevolverGround();
				Global.ballLookAt = _cameraRevolverGround.position;

				Global.activeCamera = _cameraRevolverGround;
			break;
			case "eastSettleTop":
				Global.ballLookAt = new THREE.Vector3(_cameraEastSettleTop.position.x, _cameraEastSettleTop.position.y, _cameraEastSettleTop.position.z);

				Global.activeCamera = _cameraEastSettleTop;
				restartEastSettleTop();
			break;
			case "slideWest":
				Global.ballLookAt = new THREE.Vector3(_cameraSlideWest.position.x, _cameraSlideWest.position.y, _cameraSlideWest.position.z);

				Global.activeCamera = _cameraSlideWest;
				restartSlideWest();
			break;
			case "slideEast":
				Global.ballLookAt = new THREE.Vector3(_cameraSlideEast.position.x, _cameraSlideEast.position.y, _cameraSlideEast.position.z);

				Global.activeCamera = _cameraSlideEast;
				restartSlideEast();
			break;
			case "slideUpSettle":
				Global.ballLookAt = new THREE.Vector3(_cameraSlideEast.position.x, _cameraSlideEast.position.y, _cameraSlideEast.position.z);

				Global.activeCamera = _cameraSlideUpSettle;
				restartSlideUpSettle();
			break;
			case "zoomOutSouth":
				Global.ballLookAt = new THREE.Vector3(_cameraZoomOutSouth.position.x, _cameraZoomOutSouth.position.y, _cameraZoomOutSouth.position.z);

				Global.activeCamera = _cameraZoomOutSouth;
				restartZoomOutSouth();
			break;

			default:
				Global.activeCamera = _camera;

			break;
		}

		_this.resize();
	}


	/* ===================================
	DEFAULT
	=================================== */
	function updateDefaultCam(){
		Global.ballLookAt = _camera.position;
	}


	/* ===================================
	ZOOM OUT SOUTH
	=================================== */
	function restartZoomOutSouth(){
	    _cameraZoomOutSouth.position.x = -100;
	    _cameraZoomOutSouth.position.y = 600;
	    _cameraZoomOutSouth.position.z = 100;

	    Global.camLookAt = new THREE.Vector3(0, 600, -50);

	    var yPos = 900;


		$(_cameraZoomOutSouth.position).animate({x:-1000, y:yPos, z:1000}, {duration:6500, easing:"easeOutCubic"});

		
	}

	function updateZoomOutSouth(){
		_cameraZoomOutSouth.lookAt( Global.camLookAt );

		var camPos = _cameraZoomOutSouth.position;

		Global.ballLookAt = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
	}


	/* ===================================
	SLIDE UP SETTLE
	=================================== */
	function restartSlideUpSettle(){
	    _cameraSlideUpSettle.position.x = -0.1;
	    _cameraSlideUpSettle.position.y = 600;
	    _cameraSlideUpSettle.position.z = 800;

	    Global.camLookAt = new THREE.Vector3(0, 750, -50);

	    var yPos = 1500;

	    if(Global.mobile == true){
	    	yPos = 800;
	    }

		$(_cameraSlideUpSettle.position).animate({x:-0.1, y:yPos, z:10}, {duration:6500, easing:"easeOutCubic"});

		$( Global.camLookAt ).animate({x:0, y:50, z: -50}, {duration:6500});
		
	}

	function updateSlideUpSettle(){
		_cameraSlideUpSettle.lookAt( Global.camLookAt );

		var camPos = _cameraSlideUpSettle.position;

		Global.ballLookAt = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
	}


	/* ===================================
	SLIDE EAST
	=================================== */
	function restartSlideEast(){
	    _cameraSlideEast.position.x = -400;
	    _cameraSlideEast.position.y = 800;
	    _cameraSlideEast.position.z = -400;

	    Global.camLookAt = new THREE.Vector3(0, 50, -50);

	    var yPos = 100;

		$(_cameraSlideEast.position).animate({x:400, y:800, z:-400}, {duration:4000, easing:"linear"});
		
	}

	function updateSlideEast(){
		_cameraSlideEast.lookAt( Global.camLookAt );

		var camPos = _cameraSlideEast.position;

		Global.ballLookAt = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
	}


	/* ===================================
	SLIDE WEST
	=================================== */
	function restartSlideWest(){
	    _cameraSlideWest.position.x = 400;
	    _cameraSlideWest.position.y = 100;
	    _cameraSlideWest.position.z = 400;

	    Global.camLookAt = new THREE.Vector3(0, 1200, -50);

	    var yPos = 100;

		$(_cameraSlideWest.position).animate({x:-400, y:100, z:400}, {duration:2500, easing:"linear"});
		
		$( Global.camLookAt ).delay(800).animate({x:0, y:50, z: -50}, {duration:2500});
	}

	function updateSlideWest(){
		_cameraSlideWest.lookAt( Global.camLookAt );

		var camPos = _cameraSlideWest.position;

		Global.ballLookAt = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
	}


	/* ===================================
	EAST SETTLE TOP
	=================================== */
	function restartEastSettleTop(){
	    _cameraEastSettleTop.position.x = 600;
	    _cameraEastSettleTop.position.y = 620;
	    _cameraEastSettleTop.position.z = -600;

	    var yPos = 1500;

	    if(Global.mobile == true){
	    	yPos = 800;
	    }

		$(_cameraEastSettleTop.position).animate({x:50, y:250, z:200}, {duration:1500, easing:"linear"}).animate({x:-0.001, y:yPos, z:10}, {duration:1800, easing:"easeOutCubic"})
	
	}

	function updateEastSettleTop(){
		_cameraEastSettleTop.lookAt(new THREE.Vector3(0, 0, 0));

		var camPos = _cameraEastSettleTop.position;

		Global.ballLookAt = new THREE.Vector3(camPos.x, camPos.y, camPos.z);
	}


	/* ===================================
	REVOLVER CEILING
	=================================== */
	function restartRevolverCeiling(){

		_revolverCeilingTarget.position.y = 50;
		_revolverCeilingTarget.position.z = 500;

		_revolverCeilingTargetContainer.rotation.y = 0;

		_cameraRevolverCeiling.lookAt( _revolverCeilingTarget.localToWorld( new THREE.Vector3(0, 0, 0)) );

		Global.activeCamera = _cameraRevolverCeiling;

		Global.ballLookAt = new THREE.Vector3(_cameraRevolverCeiling.position.x, _cameraRevolverCeiling.position.y, _cameraRevolverCeiling.position.z);
	}

	function updateRevolverCeilingCam(){
		var yRotIncrem = -0.5;
		var yPosIncrem = 100;

		_revolverCeilingTargetContainer.rotation.y += Global.degreesToRadians(yRotIncrem);
		_revolverCeilingTargetContainer.position.y += Global.degreesToRadians(yPosIncrem);

		_cameraRevolverCeiling.lookAt( _revolverCeilingTarget.localToWorld( new THREE.Vector3(0, 0, 0)) );
	}


	/* ===================================
	REVOLVER GROUND
	=================================== */
	function restartRevolverGround(){


		_revolverGroundTargetContainer.rotation.y = 0;
		_revolverGroundTargetContainer.position.y = 10;

		_cameraRevolverGround.lookAt( new THREE.Vector3(0, 0, 0) );

		Global.activeCamera = _cameraRevolverGround;

	}

	function updateRevolverGroundCam(){
		var yRotIncrem = -0.25;
		var yPosIncrem = 100;

		_revolverGroundTargetContainer.rotation.y += Global.degreesToRadians(yRotIncrem);
		_revolverGroundTargetContainer.position.y += Global.degreesToRadians(yPosIncrem);

		_cameraRevolverGround.lookAt(  new THREE.Vector3(0, 0, 0) );

	}


	/* ===================================
	FOLLOW
	=================================== */
	function updateFollowCam(){

		if(_camData.prevPos && _camData.prevPos.x != _camData.obj.getObject().position.x && _camData.prevPos.z != _camData.obj.getObject().position.z){
			var prevX = _camData.prevPos.x;
			var prevZ = _camData.prevPos.z;

			var currentX = _camData.obj.getObject().position.x;
			var currentZ = _camData.obj.getObject().position.z;

			var angle = Global.radiansToDegrees( Global.angleBetweenTwo( {x:prevX, y:prevZ}, {x:currentX, y:currentZ} ) ) ;


			Global.activeCamera.lookAt( _camData.obj.getObject().worldToLocal(new THREE.Vector3( 0, 0, 0)) );

			Global.ballLookAt = _camData.obj.getObject().position;
		}

		_camData.prevPos = {x:_camData.obj.getObject().position.x, z: _camData.obj.getObject().position.z};
	}

	function followCamStart(evt){
		console.log("followCamStart");

		Global.activeCamera = _cameraFollow;


		_camData.obj.getObject().add(Global.activeCamera);

		Global.activeCamera.lookAt( _camData.obj.getObject().worldToLocal(new THREE.Vector3( 0, 0, 0)) );

		Global.devConsole.switchCamera("FOLLOW");
	}


	/* ===================================
	INITIALIZATION
	=================================== */
	function init(){
		setupDefault();

		setupRevolverCeiling();

	    setupRevolverGround();

	    setupEastSettleTop();

	    setupSlideWest();

	    setupSlideEast();

	    setupSlideUpSettle();

	    setupZoomOutSouth();

	    setupRenderer();
	    
	    //setupDEV();
	}

	function setupDefault(){
		// Default Camera
	    _camera.position.z = 500;
	    _camera.position.y = 500;

	    _camera.lookAt(new THREE.Vector3(0, 15, -10));
	}

	function setupRevolverCeiling(){
	    // Revolver Cam
	    _cameraRevolverCeiling.position.x = 0;
	    _cameraRevolverCeiling.position.y = 10;
	    _cameraRevolverCeiling.position.z = 0;


	    _scene.add(_cameraRevolverCeiling);


		_revolverCeilingTargetContainer.position = new THREE.Vector3(0, 0, 0);
		_scene.add(_revolverCeilingTargetContainer);

		_revolverCeilingTargetContainer.add(_revolverCeilingTarget);

		_revolverCeilingTarget.position.y = 50;
		_revolverCeilingTarget.position.z = 500;

	}

	function setupRevolverGround(){


		_revolverGroundTargetContainer.position = new THREE.Vector3(0, 0, 0);

	    _cameraRevolverGround.position.x = 0;
	    _cameraRevolverGround.position.y = 50;
	    _cameraRevolverGround.position.z = 500;


	    _revolverGroundTargetContainer.add(_cameraRevolverGround);

		_scene.add(_revolverGroundTargetContainer);

		_scene.add(_revolverGroundTarget);

	}

	function setupEastSettleTop(){
	    _cameraEastSettleTop.position.x = 1200;
	    _cameraEastSettleTop.position.y = 60;
	    _cameraEastSettleTop.position.z = 0;

	    _scene.add(_cameraEastSettleTop);
	}

	function setupSlideWest(){
	    _cameraSlideWest.position.x = 400;
	    _cameraSlideWest.position.y = 100;
	    _cameraSlideWest.position.z = 400;

	    _scene.add(_cameraSlideWest);
	}

	function setupSlideEast(){
	    _cameraSlideEast.position.x = -400;
	    _cameraSlideEast.position.y = 100;
	    _cameraSlideEast.position.z = -400;

	    _scene.add(_cameraSlideEast);
	}

	function setupSlideUpSettle(){
	    _cameraSlideUpSettle.position.x = -400;
	    _cameraSlideUpSettle.position.y = 100;
	    _cameraSlideUpSettle.position.z = -400;

	    _scene.add(_cameraSlideUpSettle);
	}

	function setupZoomOutSouth(){
	    _cameraZoomOutSouth.position.x = -100;
	    _cameraZoomOutSouth.position.y = 600;
	    _cameraZoomOutSouth.position.z = 100;

	    _scene.add(_cameraZoomOutSouth);
	}

	function setupDEV(){
		console.warn("DEV CAMS ACTIVE");
	    _devCams = Global.createDevCams(new THREE.Vector3(0, 5, 0), _devCamDist, _scene);

	    //var controls = new THREE.OrbitControls( _camera );

	    //controls.maxPolarAngle = Math.PI/2; 
	}

	function setupRenderer(){
	    // Renderer
	    _renderer.setSize($(window).width(), $(window).height());
	    _renderer.shadowMap.enabled = true;
	    _renderer.setClearColor(new THREE.Color(0x000000) );

	    $("#canvas_3d")[0].appendChild(_renderer.domElement);
	}

	function updateRender(){
		_renderer.render(_scene, _camera);
	}


	init();
	return _this;
}