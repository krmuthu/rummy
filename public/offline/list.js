modelfilestrs['list'] = hereDoc(function(){/*!
<script type="text/javascript">

	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var list = new function() {

		// Called from xenith if tab level deeplinking is available
		this.deepLink = function(item) {
			$('.listItem').each(function(i) {
				if (
					($.isNumeric(item) && i === parseInt(item))
					|| (item.toLowerCase() === $(this).text().toLowerCase())
				) {
					$(this).click();
					return false;
				}
			});
		}

		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			$("#infoHolder").hide();
			$(".listItem.highlight").removeClass("highlight");
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function(firstLoad) {
			var $infoHolder = $("#infoHolder"),
				maxH = $x_mainHolder.height() - $x_footerBlock.height();
			if (x_browserInfo.mobile == false) {
				$infoHolder.height($x_pageHolder.height() - $("#pageContents .splitScreen").position().top - parseInt($x_pageDiv.css("padding-top")) * 2 - parseInt($infoHolder.css("padding-top")) * 2);
				maxH = $infoHolder.height();
			}
			
			$("#pageContents").data({
				"maxWH"	:[$infoHolder.width(), maxH]
			});
			
			if (firstLoad != true) {
				this.scaleImages();
			}
		}
		
		this.init = function() {
			var $listHolder = $("#listHolder"),
				$infoHolder = $("#infoHolder");
			
			$("#textHolder").html(x_addLineBreaks(x_currentPageXML.getAttribute("text")));
			
			var panelWidth = x_currentPageXML.getAttribute("panelWidth");
			if (panelWidth == "Small") {
				$("#pageContents .splitScreen").addClass("medium");
				
			} else if (panelWidth == "Medium") {
				$("#pageContents .splitScreen").addClass("medium2");
			} else {
				$("#pageContents .splitScreen").addClass("small");
			}
			
			list.sizeChanged(true);
			$infoHolder.hide();
			
			var instruction = x_getLangInfo(x_languageData.find("screenReaderInfo").find("list")[0], "click", "");
			if (instruction == null) {
				instruction = "";
			} else if (instruction != "") {
				instruction = " " + instruction;
			}
			
			var $listItem = $(".listItem:first");
			$(x_currentPageXML).children()
				.each(function(i) {
					var $thisItem;
					if (i != 0) {
						$thisItem = $listItem.clone().appendTo($listHolder);
					} else {
						$thisItem = $listItem;
					}
					
					$thisItem
						.attr({
							"href": "#item" + i + "_" + x_pageInfo[x_currentPage].linkID,
							"aria-label": x_getAriaText(this.getAttribute("name") + instruction)
							})
						.html(this.getAttribute("name"))
						.data({
							"name"	:this.getAttribute("name"),
							"text"	:this.getAttribute("text"),
							"url"	:this.getAttribute("url"),
							"obj"	:this.getAttribute("initObject"),
							"tip"	:this.getAttribute("tip"),
							"movieSize"	:this.getAttribute("movieSize"),
							"built"	:false
							})
						.on("click", function() {
							var $this = $(this);
							if ($this != $(".listItem.highlight")) {
								var infoString = "<h3>" + $this.data("name") + "</h3>" + "<p>" + x_addLineBreaks($this.data("text")) + "</p>";
								var url = $this.data("url");
								if (url != undefined && url != "") {
									if (url.split('.').pop().slice(0, -1) == "swf") {
										infoString += '<div class="centerAlign"><div id="pageSWF' + i + '" class="paneSWF"><h3 class="alert">' + x_getLangInfo(x_languageData.find("errorFlash")[0], "label", "You need to install the Flash Player to view this content.") + '</h3><p><a href="http://www.adobe.com/go/getflashplayer"><img class="flashImg" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="' + x_getLangInfo(x_languageData.find("errorFlash")[0], "description", "Get the Flash Player") + '" /></a></p></div></div>';
										
									} else if (url.split('.').pop().slice(0, -1) == "html") {
										if ($this.data("built") == false) {
											// sets up savedData for current page as an array so it can contain the initObject and any additionally saved data for this customHTML file
											if (x_pageInfo[x_currentPage].savedData == undefined) {
												x_pageInfo[x_currentPage].savedData = [];
											}
											x_pageInfo[x_currentPage].savedData.push(new Object());
											$this.data("savedDataIndex", x_pageInfo[x_currentPage].savedData.length - 1);
											
											if ($this.data("obj") != undefined && $this.data("obj") != "") {
												x_pageInfo[x_currentPage].savedData[x_pageInfo[x_currentPage].savedData.length - 1].initObject = x_sortInitObject($this.data("obj"));
											}
										}
										
										infoString += '<div class="jsHolder"></div>';
										
									} else {
										infoString += '<div class="paneImg"><img ';
										if ($this.data("tip") != undefined && $this.data("tip") != "") {
											infoString += 'alt="' + $this.data("tip") + '" ';
										}
										infoString += ' /></div>';
									}
								}
								
								$(".listItem.highlight").removeClass("highlight");
								$this.addClass("highlight");
								
								// remove any custom HTML so on previous pane so it can be added back in again later
								$(".customHTMLHolder").detach();
								
								var $infoHolder = $("#infoHolder");
								
								$infoHolder
									.html(infoString)
									.scrollTop(0);
								
								// first click on a link - show panel
								if ($("#infoHolder:visible").length == 0) {
									var thisItem = this;
									$infoHolder.fadeIn(function() {
										$(this).html(infoString); // reloaded so aria-live works after fade
										list.mediaLoad($infoHolder, thisItem, url);
										
										x_pageContentsUpdated();
									});
								}
								
								list.mediaLoad($infoHolder, this, url);
								
								x_pageContentsUpdated();
							}
						});
				});
			
			x_pageLoaded();
		}
		
		this.mediaLoad = function($infoHolder, thisItem, url) {
			if ($infoHolder.find(".paneImg").length > 0) {
				$infoHolder.find(".paneImg img")
					.one("load", function() {
						list.scaleImages();
					})
					.attr("src", x_evalURL(url))
					.each(function() { // called if loaded from cache as in some browsers load won't automatically trigger
						if (this.complete) {
							$(this).trigger("load");
						}
					});
				
			} else if ($infoHolder.find(".paneSWF").length > 0) {
				var size = [300,300];
				if (thisItem.getAttribute("movieSize") != "" && thisItem.getAttribute("movieSize") != undefined) {
					var dimensions = thisItem.getAttribute("movieSize").split(",");
					if (Number(dimensions[0]) != 0 && Number(dimensions[1]) != 0) {
						size = [Number(dimensions[0]), Number(dimensions[1])];
					}
				}
				
				swfobject.embedSWF(x_evalURL(url), "pageSWF" + i, size[0], size[1], "9.0.0", x_templateLocation + "common_html5/expressInstall.swf", "", "", "");
				if (thisItem.getAttribute("tip") != undefined && thisItem.getAttribute("tip") != "") {
					$("#pageSWF" + i).attr("title", thisItem.getAttribute("tip"));
				}
				
			} else if ($infoHolder.find(".jsHolder").length > 0) {
				var $this = $(thisItem);
				$infoHolder.find(".jsHolder").data("savedDataIndex", $this.data("savedDataIndex"));
				if ($this.data("built") != false) {
					// this has already been viewed - reload the customHTML previously used
					$this.data("built").appendTo($infoHolder.find(".jsHolder"));
					customHTML.pageChanged();
					
				} else {
					// customHTML hasn't loaded here before - load it from file
					var $thisCustomHTMLHolder = $('<div class="customHTMLHolder"></div>').appendTo($infoHolder.find(".jsHolder"));
					$this.data("built", $thisCustomHTMLHolder);
					$thisCustomHTMLHolder.load(x_evalURL(url));
				}
			}
		}
		
		// function scales image
		this.scaleImages = function() {
			var $pageContents = $("#pageContents"),
				$img = $("#infoHolder .paneImg img:visible");
			
			// is there an image?  Has it loaded?  Has it already been scaled to fit this?
			if ($img.length > 0) {
				var firstScale = false;
				if ($img.data("origSize") == undefined) {
					firstScale = true;
				}
				
				var maxW = Math.min($("#infoHolder .paneImg").width(), $pageContents.data("maxWH")[0]);
				x_scaleImg($img, maxW, $pageContents.data("maxWH")[1], true, firstScale);
				
				$img.css({
					"opacity"	:1,
					"filter"	:'alpha(opacity=100)'
				});
			}
		}
	}
	
	list.init();
	
</script>


<div id="pageContents">
	
	<div id="textHolder">
	</div>
	
	<div class="splitScreen small">
		
		<div id="listHolder" class="left">
			<a class="listItem"></a>
		</div>
		
		<div class="right">
			<div id="infoHolder" class="panel" aria-live="polite">
			</div>
		</div>
		
	</div>
	
</div>

*/});