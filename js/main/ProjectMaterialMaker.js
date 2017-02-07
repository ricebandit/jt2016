ProjectMaterialMaker.prototype = new EventDispatcher();
ProjectMaterialMaker.MATERIALS_COMPLETE = "materialsgenerated";

function ProjectMaterialMaker(data){
	
	var _this = this;

	var _textureLoader = new THREE.TextureLoader();

	var _textures = [];

	var _loadedIndex = 0;
	var _loadCompleted = data.length;

	_this.startLoading = function(){

		load(_loadedIndex);
	}

	_this.getMaterial = function(code){
		return _textures[code];
	}

	function load(id){
		var url = data[id].img + ".jpg";

		if(Global.mobile === true || Global.tablet === true){
			url = data[id].img + "_mobile.jpg";
		}

		_textureLoader.load(url, loadComplete);
	}

	function loadComplete(texture){

		var mat = new THREE.MeshBasicMaterial({
            map:texture,
            opacity:1,
            transparent:true
        })

        _textures[data[_loadedIndex].code] = mat;

		_loadedIndex ++;

		if(_loadedIndex < _loadCompleted){
			load(_loadedIndex);
		}else{
			console.log("materials completed");
			_this.dispatchEvent(ProjectMaterialMaker.MATERIALS_COMPLETE);
		}
	}

	return _this;
}