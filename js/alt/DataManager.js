DataManager.prototype = new EventDispatcher();
DataManager.LOAD_COMPLETE = "loadcomplete";

function DataManager(url){
	var _this = this;

	var _rawData;

	var _data = [];
	var _dataHistory = [];

	_this.getAllData = function(){
		return _data;
	}

	_this.getData = function(id){
		return _data[id];
	}

	_this.getHistory = function(){
		return _dataHistory;
	}

	function init(){
	    $.ajax({
	        type:"GET",
	        url:"data/data.xml",
	        success:function(data){
	            loadDataComplete(data);
	        },
	        dataType:"text"
	    });
	}

	function loadDataComplete(xml){
	    _rawData = $( $.parseXML(String(xml)) );
	    
	    var items = _rawData.find("gallery").find("project");
	    
	    // CARD DATA
	    for(var i = 0; i < items.length; i ++){
	        var item = {
	            title:$(items[i]).find("title").text(),
	            description:$(items[i]).find("description").text(),
	            mediums:$(items[i]).find("mediums").text(),
	            role:$(items[i]).find("role").text(),
	            year:$(items[i]).find("year").text(),
	            company:$(items[i]).find("company").text(),
	            client:$(items[i]).find("client").text(),
	            thumbnail:$(items[i]).find("thumbnail").text(),
	            img:$(items[i]).find("img").text(),
	            video:$(items[i]).find("videoURL").text(),
	            code: createCode($(items[i]).find("title").text())
	        }

	        
	        // ITEMIZE URLS
	        var urls = [];
	        
	        var urlItems = $(items[i]).find("url");
	        
	        for(var j = 0; j < urlItems.length; j ++){
	            var urlData = urlItems[j];
	            
	            var urlObj = {
	                url:$(urlData).find("address").text(),
	                tag:$(urlData).find("tag").text(),
	                active:$(urlData).find("address").attr("active"),
	                flash:$(urlData).find("address").attr("flash")
	            }
	            
	            urls.push(urlObj);
	        }
	        
	        item.urls = urls;
	        
	        
	        _data.push(item);

	        _data[item.code] = item;
	    }



	    // ALL PROJECTS DATA
	    var itemsHistory = _rawData.find("history").find("year");

	    for(var j = 0; j < itemsHistory.length; j++){

	    	var yearItem = {
	    		year: $(itemsHistory[j]).attr("num"),
	    		projects: []
	    	}

	    	var projects = $(itemsHistory[j]).find("project");

	    	for(var j2 = 0; j2 < projects.length; j2++){

	    		var proj = {
	    			title: $( projects[j2] ).find("title").text(),
	    			role: $( projects[j2] ).find("role").text()
	    		}

	    		yearItem.projects.push(proj);
	    	}

	    	_dataHistory.push(yearItem);

	    }

	    _this.dispatchEvent(DataManager.LOAD_COMPLETE);
	    
	}

	function createCode(str){
		return String(str).toLowerCase().replace(/ /g,'').replace("’",'').replace(":",'').replace("&",'').replace(/\//g,'');
	}

	init();

	return _this;
}