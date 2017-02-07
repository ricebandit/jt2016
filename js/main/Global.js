(function(window){

    
    this.Global = new Object();

    Global.touchdevice = Modernizr.hasEvent("touchstart");

    Global.tablet = Global.touchdevice;
    Global.mobile = false;

    Global.setMobile = function(parent){

        if(parent.width() < 570 && parent.height() < 570){
            Global.tablet = false;
            Global.mobile = true;
        }
    }
    
    Global.rgbaToHex = function(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    Global.unitsToScale = function(designatedDim, origDim){
        return designatedDim / origDim;
    }
    
    Global.degreesToRadians = function(deg){
        var rad = deg * (Math.PI/180);

        return rad;
    }
    
    Global.radiansToDegrees = function(rad){
        var deg = rad * (180/Math.PI);

        return deg;
    }

    Global.angleBetweenTwo = function(obj1, obj2){
    	return Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    }

    Global.movePointAtAngle = function(point, angle, distance){
        return { x: point.x + (Math.sin(angle) * distance), y: point.y - (Math.cos(angle) * distance) };
    }

    Global.createBox = function(parent, squareDim){

        var geom = new THREE.BoxGeometry(squareDim, squareDim, squareDim);

        var material = new THREE.MeshBasicMaterial({color:"#ff0000", side:THREE.DoubleSide});

        var boundingBox = new THREE.Mesh(geom, material);

        parent.add(boundingBox);

        return boundingBox;

    }

    Global.devCamActive = null;
    Global.createDevCams = function(v3, dist, scene){
        console.warn("DEVTOOL ACTIVE: Global.createDevCams");

        var xCam = new THREE.PerspectiveCamera( 75, $(window).width() / $(window).height(), 1, dist * 2 );
        var yCam = new THREE.PerspectiveCamera( 75, $(window).width() / $(window).height(), 1, dist * 2 );
        var zCam = new THREE.PerspectiveCamera( 75, $(window).width() / $(window).height(), 1, dist * 2 );


        
        xCam.position.x = v3.x + dist;
        xCam.position.y = v3.y;
        xCam.rotation.y = Global.degreesToRadians(90);

        yCam.position.y = v3.y + dist;
        yCam.rotation.x = Global.degreesToRadians(-90);
        
        zCam.position.y = v3.y;
        zCam.position.z = v3.z + dist;

        $("body").keypress(function(evt){

            switch(evt.keyCode){
                case 49:
                    // 1
                    Global.devCamActive = 1;
                break;
                case 50:
                    // 2
                    Global.devCamActive = 2;
                break;
                case 51:
                    // 3
                    Global.devCamActive = 3;
                break;
                default:
                    Global.devCamActive = null;
            }
        })

        scene.add(xCam);
        scene.add(yCam);
        scene.add(zCam);

        return [xCam, yCam, zCam]
;    }
    
    
}(window))