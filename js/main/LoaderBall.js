function LoaderBall(camera, material, materialBump, materialColor, materialColorHigh, ballSignatureBump, callback){
	
	var _this = this;

	var _callback = callback;

	var _radius = 10;
	// DESKTOP
	var _faces = 30;

	//MOBILE
	//var _faces = 8;

	var _ball;

	var _texture;

	var _ballGeom;
	var _ballGeomColor;
	var _ballGeomColorSmall;
	var _ballGeomBump;
	var _ballGeomSignatureBump;

	var _ballColor;
	var _ballColor1;
	var _ballColor2;
	var _ballColor3;
	var _ballColor4;
	var _ballTexture;
	var _ballBump;
	var _ballSignatureBump;

	var _spotlight;

	var _textureRotation = 0.249;
	var _color1Rotation = 0.3;


	var _color = Number('0x'+Math.floor(Math.random()*16777215).toString(16) );


	var _material;

	var _textureLoader = new THREE.TextureLoader();



	_this.kill = function(){
		_callback = null;

		_ball.remove( _spotlight );

		_spotlight = null;

		_ball = null;

		_texture = null;

		_ballGeom = null;
		_ballGeomColor = null;
		_ballGeomColorSmall = null;
		_ballGeomBump = null;

		_ballTexture = null;
		_ballBump = null;
		_ballColor1 = null;

		_ballColor2= null;

		_ballColor3 = null;
		_ballColor4 = null;


		_ballColor = null;

		_textureLoader = null;

		_this = null;
	}

	_this.setColor = function(color){

		_ballColor.material.color.setHex(color);
	}

	_this.getSize = function(){
		return _radius * 2;
	}

	_this.getObject = function(){
		return _ball;
	}

	_this.getLight = function(){

	}

	_this.update = function(rotation){
		
		_ballTexture.rotateZ( rotation.x );
		_ballTexture.rotateX( rotation.z );
	}

	_this.onRender = function(){
		_ballBump.rotateX( Global.degreesToRadians(-_textureRotation) );
		_ballBump.rotateY( Global.degreesToRadians(-_textureRotation) );
		_ballBump.rotateZ( Global.degreesToRadians(-_textureRotation) );


		_ballTexture.rotateX( Global.degreesToRadians(_textureRotation) );
		_ballTexture.rotateY( Global.degreesToRadians(_textureRotation) );
		_ballTexture.rotateZ( Global.degreesToRadians(_textureRotation) );


		_ballColor1.rotateZ( Global.degreesToRadians(_color1Rotation) );
		_ballColor4.rotateZ( Global.degreesToRadians(-_color1Rotation) );

		if(Global.mobile == false){
			_ballColor2.rotateZ( Global.degreesToRadians(-_color1Rotation) );
			_ballColor3.rotateZ( Global.degreesToRadians(_color1Rotation) );
		}

		
	}

	function init(){

		_ballGeomColor = new THREE.PlaneGeometry(_radius * 2, _radius * 2, 4, 4);
		_ballGeomColorSmall = new THREE.PlaneGeometry(_radius * 1.25, _radius * 1.25, 4, 4);
		_ballGeom = new THREE.SphereGeometry(_radius - 0.2, _faces, _faces);
		_ballGeomBump = new THREE.SphereGeometry(_radius, _faces, _faces);


		// CONTAINER
		_ball = new THREE.Object3D();


		// Create color element box
		_ballColor = new THREE.Object3D();


		// DEFAULT COLOR OF BALL (WILL CHANGE DYNAMICALLY)
		_ballColor1 = new THREE.Mesh(_ballGeomColor, materialColor );
		_ballColor1.position.z = -0.4;
		_ballColor1.material.color.setHex(_color);

		if(Global.mobile == false){
			_ballColor2 = new THREE.Mesh(_ballGeomColor, materialColor );
			_ballColor2.position.z = -0.3;
			_ballColor2.material.color.setHex(_color);
			
			_ballColor3 = new THREE.Mesh(_ballGeomColorSmall, materialColorHigh );
			_ballColor3.position.z = -0.2;
		}

		_ballColor4 = new THREE.Mesh(_ballGeomColorSmall, materialColorHigh );
		_ballColor4.position.z = -0.1;


		// Add to color box
		_ballColor.add(_ballColor1);
		_ballColor.add(_ballColor4);

		if(Global.mobile == false){
			_ballColor.add(_ballColor2);
			_ballColor.add(_ballColor3);
		}



		_ball.add(_ballColor);


		// BASIC TRANSPARENT TEXTURE LAYER
		_ballTexture = new THREE.Mesh(_ballGeom, material);

		//_ballTexture.castShadow = true;

		_ball.add(_ballTexture);



		// BUMP MAP TEXTURE LAYER
		_ballBump = new THREE.Mesh(_ballGeomBump, materialBump);
		_ball.add(_ballBump);


		addSpotlight();

		_ballColor.lookAt(camera.position);

		_callback();

	}


    function addSpotlight(){
        _spotlight = new THREE.SpotLight( _color, 2.85, 74, Global.degreesToRadians(40), 2.6 );
        _spotlight.position.set( 0, 15, 0 );

        
        _spotlight.shadow.camera.far = 20;

        _spotlight.shadow.mapSize.width = 50;
        _spotlight.shadow.mapSize.height = 50;



        _ball.add( _spotlight );
    }

	init();

	return _this;
}