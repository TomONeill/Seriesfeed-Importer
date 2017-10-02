// ==UserScript==
// @name         Seriesfeed Importer
// @namespace    http://www.seriesfeed.com
// @version      2.0
// @description  Allows you to import your favourites from Bierdopje.com.
// @match        http://*.seriesfeed.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      www.bierdopje.com
// @domain       www.bierdopje.com
// @require      http://code.jquery.com/jquery-1.12.2.min.js
// @author       Tom
// @copyright    2016+, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_xmlhttpRequest */
'use strict';

$(function() {
	// Add menu item to navigator.
	$('.nav .dropdown .dropdown-menu:eq(2)').append('<li><a href="/series/import/">Importeren</a></li>');

	if (window.location.href === "http://www.seriesfeed.com/series/import/") {
		var wrapper    = $('.wrapper').addClass('bg').removeClass('show padding');
		var container  = $('.wrapper .container').html('').addClass("content");
		var selector   = $(document.createElement("div")).addClass("platformSelector");
		var card       = $(document.createElement("div")).addClass("wow fadeInUp cardStyle cardForm formBlock animated");
		var importHead = $(document.createElement("h2")).append('Series importeren');
		var cardInner  = $(document.createElement("div")).addClass("cardFormInner");
		var platform   = $(document.createElement("p")).append('Kies een platform:');

		container.append(selector);
		selector.append(card);
		card.append(importHead);
		card.append(cardInner);
		cardInner.append(platform);

		var bierdopje = platformFactory("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "bierdopje/", "#3399FE");
		bierdopje.addClass('wow fadeInLeft cardStyle cardForm formBlock animated');
		platform.after(bierdopje);
	}

	if (window.location.href === "http://www.seriesfeed.com/series/import/bierdopje/") {
		var head = $('.col-md-12 h1').html('');
		var p    = $('.col-md-12 p').html('');
		
		var css = '<style>'
		        + '    .progress {'
		        + '        margin-top: 10px;'
		        + '        margin-bottom: 0px;'
		        + '    }'
		        + '    '
		        + '    .progress-bar {'
                + '        background: #447C6F;'
		        + '    }'
		        + '</style>';
		$('body').append(css);

		var formElement   = $(document.createElement("div"));
		var usernameInput = $('<div><input type="text" id="username" class="form-control" placeholder="Gebruikersnaam" /></div>');
		var submitInput   = $('<div><input type="button" id="fav-import" class="btn btn-success btn-block" value="Favorieten Importeren" /></div>');
		var bottomPane    = $('<div class="blog-left"></div>');
		var detailsTable  = $('<table class="table table-hover responsiveTable favourites stacktable large-only" id="details">');
		var colGroup      = $('<colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');
		var detailsHeader = $('<tr><th style="padding-left: 30px;">Id</th><th>Serie</th><th>Status</th></tr>');
		var showDetails   = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');
		
		formElement.addClass('blog-left wow fadeInUp cardStyle cardForm formBlock animated');
		bottomPane.addClass('wow fadeInLeft cardStyle animated');
		detailsTable.addClass('wow fadeInLeft cardStyle animated');
		formElement.css('padding', '10px');

		head.append('Series importeren - Bierdopje.com');
		p.append('Voer je gebruikersnaam in en klik op de knop "Favorieten Importeren"');

		formElement.append(usernameInput);
		formElement.append(submitInput);
		p.after(formElement);
		detailsTable.append(colGroup);
		detailsTable.append(detailsHeader);
		bottomPane.append(showDetails);
		showDetails.append(detailsTable);
		
		getCurrentBierdopjeUser().then(function(user) {
			$('#username').attr('value', user);
		});

		$("#fav-import").click(function() {
			var favImportBtn = $(this);
			var outerProgress = $('<div class="progress"></div>');
			var progressBar   = $('<div class="progress-bar progress-bar-striped active"></div>');
			
			favImportBtn.prop('disabled', true).attr('value', "Bezig met importeren...");
			outerProgress.append(progressBar);
			formElement.append(outerProgress);
			formElement.after(bottomPane);

			var username = $('#username').val();
			var favourites = $('#details');

			$("#show-details").click(function() {
				detailsTable.toggle();
			});
			
			getAllBierdopjeFavouritesByUsername(username).then(function(bdFavouritesPageData) {
				var bdFavouritesData = $('<div></div>').html(bdFavouritesPageData.responseText);
				var bdFavouriteLinks = bdFavouritesData.find('.content').find('ul').find('li').find('a');
				var bdFavouritesLength = bdFavouriteLinks.length;

				function getBierdopjeFavourite(index) {
					return new Promise(function(resolve) {
						var bdShowName = $(bdFavouriteLinks[index]).text();
						var bdShowSlug = $(bdFavouriteLinks[index]).attr('href');
						var bdShowUrl = 'http://www.bierdopje.com/shows';

						getBierdopjeShowPageDataByShowSlug(bdShowSlug).then(function(bdFavouritePageData) {
							var bdFavouriteData = $('<div></div>').html(bdFavouritePageData.responseText);
							var tvdbId = bdFavouriteData.find('a[href^="http://www.thetvdb.com"]').html();

							getSeriesfeedShowDataByTVDBId(tvdbId).success(function(sfShowData) {
								var showId = sfShowData.id;
								var showName = sfShowData.name;
								var sfShowSlug = sfShowData.slug;
								var sfShowUrl = 'http://www.seriesfeed.com/series/';

								addSeriesfeedFavouriteByShowId(showId).success(function(result) {
									var resultStatus = result.status;
									var status = "-";
									var showUrl = sfShowUrl + sfShowSlug;
									
									if (showId === -1) {
										showId = "Onbekend";
									}
									
									if (!showName) {
										showUrl = bdShowUrl + bdShowSlug;
										showName = bdShowName;
									}

									if (resultStatus === "success") {
										status = "Toegevoegd als favoriet.";
									} else if (resultStatus === "failed" && showId === "Onbekend") {
										status = '<a href="' + sfShowUrl + 'voorstellen/" target="_blank">Deze serie staat nog niet op Seriesfeed.</a>';
									} else {
										status = "Deze serie kan niet toegevoegd worden. Mogelijk is deze serie al een favoriet.";
									}

									var item = '<tr><td>' + showId + '</td><td><a href="' + showUrl + '" target="_blank">' + showName + '</a></td><td>' + status + '</td></tr>';
									favourites.append(item);

									var progress = (index/bdFavouritesLength) * 100;
									progressBar.css('width', Math.round(progress) + "%");

									resolve();
								}).error(function(error) {
									console.log("Could not connect to Seriesfeed to favourite show " + showName + " with id " + showId + ".");
								});
							}).error(function(error) {
								console.log("Could not connect to Seriesfeed to convert TVDB id " + tvdbId + ".");
							});
						}, function(error) {
							console.log("Could not connect to Bierdopje to get " + bdShowName + ".");
						});
					});
				}
				
				Promise.resolve(0).then(function loop(i) {
					if (i < bdFavouritesLength) {
						return getBierdopjeFavourite(i).thenReturn(i + 1).then(loop);
					}
				}).then(function() {
					favImportBtn.prop('disabled', false);
					favImportBtn.attr('value', "Favorieten Importeren");
					outerProgress.removeClass('progress');
					progressBar.replaceWith("Importeren voltooid.");
				}).catch(function(error) {
					console.log("Unknown error: ", error);
				});
			}, function(error) {
                console.log("Could not connect to Bierdopje to get your favourites.");
			});
		});
	}

	function getCurrentBierdopjeUser() {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/stats",
				onload: function(bdStatsPageData) {
					var bdStatsData  = $('<div></div>').html(bdStatsPageData.responseText);
					var user = bdStatsData.find('#userbox_loggedin').find('h4').html();
					resolve(user);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}

	function platformFactory(name, image, url, colour) {
		// Element declaration
		var portfolio = $(document.createElement("div"));
		var a         = $(document.createElement("a"));
		var wrapper   = $(document.createElement("div"));
		var hover     = $(document.createElement("div"));
		var img       = $(document.createElement("img"));
		var info      = $(document.createElement("div"));
		var title     = $(document.createElement("div"));
		var h4        = $(document.createElement("h4"));

		// Adding classes
		portfolio.addClass("portfolio mix_all");
		wrapper.addClass("portfolio-wrapper cardStyle");
		hover.addClass("portfolio-hover");
		info.addClass("portfolio-info");
		title.addClass("portfolio-title");

		// Styling
		portfolio.css({
			'display': 'inline-block',
			'width': '100%'
		});
		hover.css({
			'text-align': 'center',
			'background': colour
		});

		// Data binding
		a.attr('href', url);
		img.attr('src', image).attr('alt', name);
		h4.append(name);

		// Element binding
		portfolio.append(a);
		a.append(wrapper);
		wrapper.append(hover);
		hover.append(img);
		wrapper.append(info);
		info.append(title);
		title.append(h4);

		return portfolio;
	}
	
	function getAllBierdopjeFavouritesByUsername(username) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/users/" + username + "/shows",
				onload: function(response) {
                    resolve(response);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}
	
	function getBierdopjeShowPageDataByShowSlug(showSlug) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com" + showSlug,
				onload: function(response) {
                    resolve(response);
				},
				onerror: function(error) {
				    reject(error);
				}
			});
		});
	}

	function getSeriesfeedShowDataByTVDBId(tvdbId) {
		return $.ajax({
			type: "POST",
			url: "/ajax.php?action=getShowId",
			data: { tvdb_id: tvdbId },
			dataType: "json"
		});
	}

	function addSeriesfeedFavouriteByShowId(showId) {
		return $.ajax({
			type: "POST",
			url: "/ajax.php?action=updateFavourite",
			data: {
				series: showId,
				type: 'favourite',
				selected: '0'
			},
			dataType: "json"
		});
	}

	Promise.prototype.thenReturn = function(value) {
		return this.then(function() {
			return value; 
		});
	};
});