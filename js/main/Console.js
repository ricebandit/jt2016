function Console(){
	
	var _this = this;


	_this.switchCamera = function(type){
		$("#console #camera").html("CAMERA: " + type);
	}

	_this.resize = function(){
		$("#console #screen").html("SCREEN: " + $(window).width() + "x" + $(window).height() );
	}

	function init(){
		$("#console #camera").html("CAMERA: ");

		$("#console #screen").html("SCREEN: " + $(window).width() + "x" + $(window).height() );
		$("#console #mobile").html("MOBILE: " + Global.mobile );
		$("#console #tablet").html("TABLET: " + Global.tablet );
	}

	init();
	return _this;
}