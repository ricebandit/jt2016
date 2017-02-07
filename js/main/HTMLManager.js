HTMLManager.prototype = new EventDispatcher();
HTMLManager.PROJECT_SELECTED = "projecthasbeenselected";

function HTMLManager(data, history){
	
	var _this = this;

	var _history = history;

	var _videoRatio = 0;

	_this.resize = function(){
		
		// Video height
		$("#project_page #video").css({height: $("#project_page #video").width() * _videoRatio});

		//$("#project_page").css({minHeight: $(window).height()});

	}

	_this.showPage = function(pageID){
		$(".showPage").removeClass('showPage');
		$(".turnOnPage").removeClass('turnOnPage');

		$("#" + pageID).addClass("turnOnPage");
		

		setTimeout(function(){
			$("#" + pageID).addClass("showPage");
			_this.resize();
		}, 100);

		
	}

	_this.hidePage = function(){
		$(".showPage").removeClass('showPage');
		$(".turnOnPage").removeClass('turnOnPage');
	}

	_this.setInfo = function(code){
		var dataInfo = data[code];

		// Set Video ratio
		_videoRatio = dataInfo.videoHeight / dataInfo.videoWidth;


		$("#project_page #project_title").html(dataInfo.title);

		$("#project_page #year_role").html(dataInfo.year + " | " + dataInfo.role);

		$("#project_page #project_client").html(dataInfo.company + " | " + dataInfo.client);

		$("#project_page #description_text").html(dataInfo.description);

		$("#project_page #mediums_text").html(dataInfo.mediums);

		$("#project_page #urls").html('');

		for(var i = 0; i < dataInfo.urls.length; i ++){
			
			$("#project_page #urls").append('<div class="project_link active_' + dataInfo.urls[i].active + ' flash_' + dataInfo.urls[i].flash + '" data-url="' + dataInfo.urls[i].url + '">' + dataInfo.urls[i].tag + '</div>');
			$("#project_page #urls").append('<br />')
		}

		$("#project_page #video").html('<iframe src="https://player.vimeo.com/video/' + dataInfo.video + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');

		//$("#project_page .active_false").css({opacity:0.2});

		$("#project_page .active_true").on("click", function(evt){
			window.open(evt.target.dataset.url, "_blank");
		})
	}

	_this.killInfo = function(){
		$("#project_page .project_link").unbind("click");



		$("#project_page #project_title").html("");

		$("#project_page #year_role").html("");

		$("#project_page #project_client").html("");

		$("#project_page #description_text").html("");

		$("#project_page #mediums_text").html("");
		
		$("#project_page #urls").html('');

		$("#project_page #video").html('');


	}

	function init(){
		generateMarkupForSelections();
	}

	function generateMarkupForSelections(){

		var parent = $("#selection");


		// FEATURED PROJECTS
		parent.append('<div class="title font-effect-outline">FEATURED PROJECTS</div>');
		parent.append('<br />');

		for(var i = 1; i < data.length; i ++){
			var itemData = data[i];

			parent.append('<div class="col-sm-4" id="selection_' + itemData.code + '"><div class="panel"></div></div>');

			var container = $("#selection #selection_" + itemData.code + " .panel");


			container.append('<a href="#" data-code=' + itemData.code + '><img src="' + itemData.img + '_thumb.jpg" class="img-circle center-block" alt="' + itemData.title + '"><div class="proj_title font-effect-outline"><p>' + itemData.title + '</p></div></a>');

		}
		parent.append('<br />');

		// ALL PROJECTS
		parent.append('<div class="container" id="list_all"><div class="title  font-effect-outline">HISTORY</div></div>');

		for (var j = 0; j < history.length; j++){
			$("#list_all").append('<br />');
			$("#list_all").append('<div class="container year_block" id="yearItems_' + history[j].year + '"></div>');
			$("#yearItems_" + history[j].year).append('<br />');
			$("#yearItems_" + history[j].year).append('<div class="item_year font-effect-outline">' + history[j].year+ '</div>');
			$("#yearItems_" + history[j].year).append('<br />');

			var yearItems = history[j].projects;

			for(var j2 = 0; j2 < yearItems.length; j2 ++){
				$("#yearItems_" + history[j].year).append('<div class="project font-effect-outline">' + yearItems[j2].title + '</div>');
				$("#yearItems_" + history[j].year).append('<div class="role font-effect-outline">' + yearItems[j2].role + '</div>');
				$("#yearItems_" + history[j].year).append('<br />');
			}
		}
		
		$("#list_all").append('<br />');



		$("#selection a").on("click", function(evt){
			evt.preventDefault();

			_this.dispatchEvent(HTMLManager.PROJECT_SELECTED, $(evt.currentTarget).data("code") );


			//$("#selection").slideUp({duration:1000, easing:"easeOutCubic"});
			_this.hidePage();
		})


		$("#project_page button").on("click", function(evt){
			evt.preventDefault();

			//_this.dispatchEvent(HTMLManager.PROJECT_SELECTED, $(evt.currentTarget).data("code") );
			//$("#selection").slideDown({duration:1000, easing:"easeOutCubic"});

			
			setTimeout(function(){
				_this.killInfo();
			}, 500);

			//$("#project_page").slideUp({duration:1000, easing:"easeOutCubic"});

			_this.showPage("selection");
		})


		var clipboardEmail = new Clipboard("#navBottom .email");
		clipboardEmail.on("success", function(evt){
			alert("Copied to clipboard! Please paste my email address into your favorite email app and send me a message!");
		})


		$("#navBottom .resume").on("click", function(){
			window.open("media/docs/Jeremy Tani 2017.pdf", "_blank");
		})

		console.log('call resize');
		_this.resize();
	}

	init();

	return _this;
}