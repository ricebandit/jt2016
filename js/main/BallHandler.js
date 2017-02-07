BallHandler.prototype = new EventDispatcher();
BallHandler.SHOW_PROJECT = "showcurrentproject";
BallHandler.SHOW_PROJECT_PAGE = "showcurrentprojectpage";
BallHandler.SHOW_SELECTION = "showcurrentproject";

function BallHandler(scene, patternMaker, materialMaker){
	
	var _this = this;

	var _currentCode;
	var _currentPattern;


	var _maxBalls = patternMaker.getMaxNumber();

	var _balls;

	var _animationTypes = ["straightIn", "drip", "pingpong"];
	var _animationIndex = 0;

	var _ballPoints;
	

	var _projectGeom;
	var _projPlane;


	_this.displayProject = function(id){
		_currentCode = id;
		defineBallSet(id);

		setTimeout(function(){
			_this.removeProjectPlane();

		}, 100);
		
	}

	_this.setBallsData = function(balls){
		_balls = balls;
	}
 
	_this.render = function(){

		if(_balls){

		    for(var i = 0; i < _balls.length; i ++){
		    	var ball = _balls[i];

		    	if(ball.checkActive() === true){
		    		ball.onRender();
		    	}else{
		    		break;
		    	}
		    }
		}
	}

	_this.removeProjectPlane = function(){
		// If exists
		if(_projPlane){

			var opacity = 1;
			var opacityUnit = 0.02;
			var opacityINT = setInterval(function(){
				if( _projPlane.material.opacity > 0){
					_projPlane.material.opacity -= opacityUnit;
				}else{
					clearInterval(opacityINT);
				}
			}, 1);

			$(_projPlane.position).animate({y:0}, {duration:500, easing:"easeOutCubic", complete:function(){
				scene.remove(_projPlane);

				if(opacityINT){
					clearInterval(opacityINT);
				}
			}});

		}
	}

	function init(){
		createProjectImageMesh();

		patternMaker.addEventListener(PatternMaker.PATTERN_GENERATED, function(evt){
			_ballPoints = evt.points;
			setBalls();

		})

		Global.cameraManager.switchCamera("default");
	}

	function createProjectImageMesh(){
		_projectGeom = new THREE.PlaneGeometry(100, 100, 10);

	}

	function defineBallSet(id){
		_currentPattern = patternMaker.getPattern(id);

	}

	function setBalls(){


		var imgDims = patternMaker.getImageDims();


		for(var i = 0; i < _maxBalls; i++){
			if(i == _ballPoints.length){ break; }

			_balls[i].setColor( _ballPoints[i].hex );
			_balls[i].activate();

			var ball = _balls[i].getObject();

			var xPos = _ballPoints[i].x - ( imgDims.width * 0.5);
			var yPos = _balls[i].getSize() * 0.5;
			var zPos = _ballPoints[i].y - (imgDims.height * 0.5);

			_balls[i].setRestPosition( new THREE.Vector3(xPos, yPos, zPos) );

		}

		chooseAnimation();
	}

	function chooseAnimation(){
		var chosenAnimation = _animationIndex;

		switch(chosenAnimation){
			case 0:
				setupAnimationStraightIn();
				cameraSequenceStraightIn();
			break;
			case 1:
				setupAnimationDrip();
				cameraSequenceDrip();
			break;
			case 2:
				setupAnimationPingPong();
				cameraSequencePingPong();
			break;
		}

		_animationIndex ++;

		if(_animationIndex == _animationTypes.length){
			_animationIndex = 0;
		}
	}

	function cameraSequenceStraightIn(){
		// Choose random ball to follow
		var ballNum = Math.floor(Math.random() * _ballPoints.length);

		var ball = _balls[ballNum];

		ball.hideElementsForCamera();

		var ballObject = ball.getObject();

		Global.cameraManager.switchCamera("revolverGround");

		// Switch to follow cam
		setTimeout( function(){
			Global.cameraManager.switchCamera("follow", {obj:ball});
		}, 3000);

		setTimeout(function(){
			Global.cameraManager.switchCamera("eastSettleTop");
		}, 8000);

		setTimeout(function(){
			createProjectImage();
		}, 12000);
	}

	function cameraSequenceDrip(){

		Global.cameraManager.switchCamera("slideWest");

		setTimeout(function(){
			Global.cameraManager.switchCamera("slideEast");
		}, 2500)

		setTimeout(function(){
			Global.cameraManager.switchCamera("slideUpSettle");
		}, 4500)


		setTimeout(function(){
			createProjectImage();
		}, 10000);
	}

	function cameraSequencePingPong(){

		Global.cameraManager.switchCamera("zoomOutSouth");

		setTimeout(function(){
			Global.cameraManager.switchCamera("slideUpSettle");
		}, 4500)

		setTimeout(function(){
			createProjectImage();
		}, 8000);
	}

	function createProjectImage(){
		var material = materialMaker.getMaterial(_currentCode);


		// Modify scale of plane geometry
		var imgDims = patternMaker.getImageDims();

		_projPlane = new THREE.Mesh(_projectGeom, material);
		_projPlane.position.y = 50;
		_projPlane.rotation.x = Global.degreesToRadians(-90);

		var scaleX = Global.unitsToScale(imgDims.width, 100);
		var scaleY = Global.unitsToScale(imgDims.height, 100);
		_projPlane.scale.set(scaleX, scaleY, 1 );

		_projPlane.material.opacity = 0;

		scene.add(_projPlane);


		// Calculate manual transform
		var transformLength = 3000;
		var opacityUnit = 10 / (transformLength * 0.08);
		var projOpacity = 0;

		var opacityIndex = 0;

		var opacityINT = setInterval(function(){
			_projPlane.material.opacity = projOpacity;

			projOpacity += opacityUnit;

			if(projOpacity >= 1){
				clearInterval(opacityINT);
				//$(_projPlane.position).animate({y:1490}, {duration:1000, easing:"easeInCubic", complete:cleanupProject});
				
			}

			


		}, 1);

		$(_projPlane.position).animate({y:200}, {duration:1000, easing:"easeOutCubic", complete:removeBalls});

		setTimeout(function(){
			cleanupProject();
		}, 1500);



	}

	function setupAnimationStraightIn(){
		var imgDims = patternMaker.getImageDims();

		for(var i = 0; i < _maxBalls; i++){
			if(i == _ballPoints.length){ break; }

			var ball = _balls[i].getObject();

			var xPos = _ballPoints[i].x - ( imgDims.width * 0.5);
			var yPos = _balls[i].getSize() * 0.5;
			var zPos = _ballPoints[i].y - (imgDims.height * 0.5);


			var angle = Global.radiansToDegrees( Global.angleBetweenTwo({x:0, y:0}, {x:xPos, y:zPos}) );
			angle += 90;
			var newPoint = Global.movePointAtAngle({x:0, y:0}, Global.degreesToRadians(angle), 2500  );
			

			var startX = newPoint.x;
			var startY = yPos;
			var startZ = newPoint.y;

			var startingPoint = new THREE.Vector3( startX, startY, startZ );

			_balls[i].setStartCoords( startingPoint );

			scene.add(ball);

			var delay = Math.random() * 3000;
			_balls[i].animateIn("straightIn", delay);
		}
	}

	function setupAnimationDrip(){
		var imgDims = patternMaker.getImageDims();

		var delay = 0;

		for(var i = 0; i < _maxBalls; i++){
			if(i == _ballPoints.length){ break; }
			
			var ball = _balls[i].getObject();

			var startX = (Math.random() * 100) - 50;
			var startY = 3000;
			var startZ = (Math.random() * 100) - 100;

			var startingPoint = new THREE.Vector3( startX, startY, startZ );

			_balls[i].setStartCoords( startingPoint );

			scene.add(ball);

			var delay = Math.random() * 5000;

			_balls[i].animateIn("drip", delay);
		}
	}

	function setupAnimationPingPong(){
		var imgDims = patternMaker.getImageDims();

		var delay = 0;

		for(var i = 0; i < _maxBalls; i++){
			if(i == _ballPoints.length){ break; }
			
			var ball = _balls[i].getObject();

			var xPos = _ballPoints[i].x - ( imgDims.width * 0.5);
			var yPos = (_balls[i].getSize() * 0.5) + (Math.random() * 2500);
			var zPos = _ballPoints[i].y - (imgDims.height * 0.5);


			var angle = Global.radiansToDegrees( Global.angleBetweenTwo({x:0, y:0}, {x:xPos, y:zPos}) );
			angle += 90;
			var newPoint = Global.movePointAtAngle({x:0, y:0}, Global.degreesToRadians(angle), 2500  );
			

			var startX = newPoint.x;
			var startY = yPos;
			var startZ = newPoint.y;

			var startingPoint = new THREE.Vector3( startX, startY, startZ );

			_balls[i].setStartCoords( startingPoint );

			scene.add(ball);

			var delay = Math.random() * 5000;

			_balls[i].animateIn("pingpong", delay);
		}
	}

	function cleanupProject(){

		//removeBalls();

		//scene.remove(_projPlane);

		setTimeout(function(){
			if(_currentCode === "jeremytani"){
				_this.dispatchEvent(BallHandler.SHOW_SELECTION, _currentCode);
			}else{
				_this.dispatchEvent(BallHandler.SHOW_PROJECT_PAGE, _currentCode);
			}
			
		}, 500);
	}

	function removeBalls(){


	    for(var i = 0; i < _balls.length; i ++){
	    	var ball = _balls[i];

	    	if(ball.checkActive() === true){
	    		scene.remove( ball.getObject() );
	    		ball.deactivate();

	    	}else{
	    		break;
	    	}
	    }
	}

	init();

	return _this;
}