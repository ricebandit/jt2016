Ball.prototype = new EventDispatcher();
Ball.BALL_GENERATED = "ballgenerated";
Ball.ANIMATION_START = "animationisstarting";

function Ball(id, material, materialColor, materialColorHigh, callback){
	
	var _this = this;

	var _callback = callback;

	var _radius = 10;

	// DESKTOP
	var _faces = 15;

	//MOBILE
	if(Global.mobile === true || Global.tablet === true){
		_faces = 6;
	}

	var _ball;

	var _texture;

	var _ballGeom;
	var _ballGeomColor;
	var _ballGeomColorSmall;
	var _ballGeomBump;

	var _ballColor;
	var _ballColor1;
	var _ballColor4;
	var _ballTexture;
	var _ballBump;

	var _spotlight;

	var _color1Rotation = 0.8;

	if(Global.tablet === false){
		//_color1Rotation = 0.6;
	}

	var _material;

	var _uniforms;


	var _textureLoader = new THREE.TextureLoader();

	var _id = id;

	var _restingPos;

	var _active = false;

	var _currentCoord;
    var _xRotAxis = new THREE.Vector3(0, 0, 0);
    var _yRotAxis = new THREE.Vector3(0, 0, 0);
    var _zRotAxis = new THREE.Vector3(0, 0, 0);



    /* ================================
	PUBLIC
    ================================== */

    // ANIMATIONS

	_this.animateIn = function(typeID, delay){

		switch(typeID){
			case "straightIn":
				animateInStraightIn(delay);
			break;
			case "drip":
				animateInDrip(delay);
			break;
			case "pingpong":
				animateInPingPong(delay);
			break;
		}

	}

	function animateInStraightIn(delay){
		
		
    	$(_ball.position).delay( delay ).animate({x:_restingPos.x, z:_restingPos.z}, {duration: 8000, step:function(){
    		_this.update();

    	}})
	}

	function animateInDrip(delay){

		_this.toggleShadow(false);
		
		
    	$(_ball.position).delay( delay ).animate({x:_currentCoord.x, y:_radius, z:_currentCoord.z}, {duration:2000, complete:function(){
    		_this.toggleShadow(true);
    	}}).animate({x:_restingPos.x, z:_restingPos.z}, {duration: 2000, step:function(){
    		_this.update();

    	}})
	}

	function animateInPingPong(delay){
		
		
    	$(_ball.position).delay( delay ).animate({x:(Math.random() * 5000) - 2500, y:_radius + (Math.random() * 2500), z:(Math.random() * 5000) - 2500}, {duration:500, easing:"easeInCubic"}).animate({x:(Math.random() * 5000) - 2500, y:_radius + (Math.random() * 2500), z:(Math.random() * 5000) - 2500}, {duration:500, easing:"linear"}).animate({x:(Math.random() * 5000) - 2500, y:_radius + (Math.random() * 2500), z:(Math.random() * 5000) - 2500}, {duration:500, easing:"linear"}).animate({x:(Math.random() * 5000) - 2500, y:_radius + (Math.random() * 2500), z:(Math.random() * 5000) - 2500}, {duration:500, easing:"linear"}).animate({x:_restingPos.x, y:_radius, z:_restingPos.z}, {duration: 500, easing:"easeOutCubic"})
	}

	// SETTINGS

	_this.toggleShadow = function(tog){
		_ballTexture.castShadow = tog;
	}


	_this.activate = function(){
		_active = true;
	}

	_this.deactivate = function(){
		_active = false;
	}

	_this.checkActive = function(){
		return _active;
	}

	_this.getID = function(){
		return _id;
	}

	_this.setRestPosition = function(v3){
		_restingPos = v3;
	}

	_this.getRestingPosition = function(){
		return _restingPos;
	}

	_this.setColor = function(color){
		_ballColor1.material.color.setHex(color);


	}

	_this.getSize = function(){
		return _radius * 2;
	}

	_this.getObject = function(){
		return _ball;
	}

	_this.getLight = function(){

	}

	_this.setStartCoords = function(v3){
		_currentCoord = v3;

		_ball.position.x = _currentCoord.x;
		_ball.position.y = _currentCoord.y;
		_ball.position.z = _currentCoord.z;
	}

	_this.hideElementsForCamera = function(){
		_ball.remove(_ballColor);
	}

	_this.showElementsForCamera = function(){
		_ball.add(_ballColor);
	}

	_this.update = function(){

		rotateBall();
	}

	_this.onRender = function(){

		if(Global.mobile === false && Global.tablet === false){
			_ballColor1.rotateZ( Global.degreesToRadians(_color1Rotation) );
			_ballColor4.rotateZ( Global.degreesToRadians(-_color1Rotation) );
		}

		

		_ballColor.lookAt( Global.ballLookAt );


	}



    /* ================================
	PRIVATE
    ================================== */
	function init(){

		_ballGeomColor = new THREE.PlaneGeometry(_radius * 2, _radius * 2, 4, 4);
		_ballGeomColorSmall = new THREE.PlaneGeometry(_radius * 1, _radius * 1, 4, 4);
		_ballGeom = new THREE.SphereGeometry(_radius, _faces, _faces);


		// CONTAINER
		_ball = new THREE.Object3D();

		// CONTAINER for Ball Colors
		_ballColor = new THREE.Object3D();

		// DEFAULT COLOR OF BALL (WILL CHANGE DYNAMICALLY)
		var colorMaterial = materialColor.clone();

		_ballColor1 = new THREE.Mesh(_ballGeomColor, colorMaterial );
		_ballColor1.position.z = -0.4;

		_ballColor4 = new THREE.Mesh(_ballGeomColorSmall, materialColorHigh );
		_ballColor4.position.z = -0.1;


		// Add to color box
		_ballColor.add(_ballColor1);
		_ballColor.add(_ballColor4);


		_ball.add(_ballColor);


		// BASIC TRANSPARENT TEXTURE LAYER
		_ballTexture = new THREE.Mesh(_ballGeom, material);

		_ballTexture.castShadow = true;

		_ball.add(_ballTexture);



		// DEFAULT COLOR OF BALL (WILL CHANGE DYNAMICALLY)

		_ball.add(_ballColor);

		_ball.rotation = new THREE.Vector3(0, 0, 0);


		_callback();

	}

	function rotateBall(){
		var obj = _ball;

		var currentStep = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);

		var xDist = _currentCoord.x - currentStep.x;
		var zDist = _currentCoord.z - currentStep.z;

		var xAngle = xDist / (2 * Math.PI * _radius ) * Math.PI;
		var zAngle = zDist / (2 * Math.PI * _radius ) * Math.PI;

		_ballTexture.rotateZ( xAngle );
		_ballTexture.rotateX( -zAngle );
		
		// Update step position
    	_currentCoord = currentStep;
	}



	init();

	return _this;
}