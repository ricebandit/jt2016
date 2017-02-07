PatternMaker.prototype = new EventDispatcher();
PatternMaker.PATTERN_GENERATED = "patterngenerated";

function PatternMaker(){

	var _this = this;

	//DESKTOP
	var _maxPattern = 625;
	var _segments = 25; // Rows always consist of 100.

	// TABLET
	if(Global.tablet === true){
		_maxPattern = 210;
		_segments = 15; // Rows always consist of 100.
	}

	// MOBILE
	if(Global.mobile === true){
		_maxPattern = 145;
		_segments = 12; // Rows always consist of 100.
	}

	var _imgDims;


	var _dev = true;
	var _stage;

	_this.getMaxNumber = function(){
		return _maxPattern;
	}

	_this.getPattern = function(id){
		console.log("getPattern", id);
		generatePattern(id);
	}

	_this.getImageDims = function(){
		return _imgDims;
	}

	_this.clear = function(){

	}

	function init(){

		generate2DCanvas();
	}

	function generatePattern(id){
		var rawImg = Global.loadQueue.getResult(id);
		var img = new createjs.Bitmap( rawImg );

		var imgW = img.image.width;
		var imgH = img.image.height;
		var imgRatio = imgH / imgW;

		_imgDims = {width:imgW, height:imgH};

		var segmentDimension = imgW / (_segments - 1);
		var hSegments = _segments;
		var vSegments = Math.floor(_segments * imgRatio);

		var yPos = 0;

		var points = [];
		// i = rows, j = columns
		for(var i = 0; i < vSegments; i ++){

			for(var j = 0; j < hSegments; j++){

				var pntX = segmentDimension * j;
				var pntY = segmentDimension * i;

				points.push( {x:Math.floor(pntX), y: Math.floor(pntY)} );
			}

		}
		
		_stage.addChild(img);
		$("#canvas_2d #2d_stage").attr("width", img.image.width);
		$("#canvas_2d #2d_stage").attr("height", img.image.height);

		// Allow device to add image to stage before attempting to retrieve colors

		var delay = 2000;

		if(Global.mobile === true){
			delay = 1000;
		}

		setTimeout(function(){
			console.log("retrieving colors...");
			for(var k = 0; k < points.length ; k ++){
				points[k].hex = getColorAt(points[k]);
			}

			_stage.removeChild(img);

			_this.dispatchEvent(PatternMaker.PATTERN_GENERATED, {points:points});

		}, delay);


	}

	function getColorAt(point){
		var canvas = document.getElementById("2d_stage");
		var context = canvas.getContext("2d");


		var pixelData = context.getImageData(point.x, point.y, 1, 1);


		var color = Global.rgbaToHex( "rgba(" + pixelData.data[0] +  "," +  pixelData.data[1] + "," +  pixelData.data[2] + "," +  pixelData.data[3] + ")" );
		

		return color.replace("#", "0x");
	}

	function generate2DCanvas(){
		$("#canvas_2d").append("<canvas id='2d_stage' width='400' height='400'></canvas>");

		_stage = new createjs.Stage("2d_stage");
		createjs.Ticker.addEventListener("tick", _stage);

	}

	init();

	return _this;
	
}