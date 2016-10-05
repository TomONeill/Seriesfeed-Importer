// ==UserScript==
// @name         Seriesfeed Importer
// @namespace    http://www.seriesfeed.com
// @version      2.2
// @description  Allows you to import your favourites from Bierdopje.com.
// @updateURL 	 https://github.com/TomONeill/Seriesfeed-Importer/raw/master/SeriesfeedImport.user.js
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
/* global $, GM_xmlhttpRequest, Promise, console */
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
                + '    '
		        + '    tr.row-error {'
		        + '        background-color: rgba(255, 0, 0, 0.15);'
		        + '    }'
                + '    '
		        + '    tr.row-warning {'
		        + '        background-color: rgba(255, 231, 150, 0.43);'
		        + '    }'
                + '    '
		        + '    tr.row-info {'
		        + '        background-color: rgba(240, 248, 255, 1.00);'
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
		
		getCurrentBierdopjeUsername().then(function(username) {
			$('#username').attr('value', username);
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

						getTVDBIdByBierdopjeShowSlug(bdShowSlug).then(function(tvdbId) {
							getSeriesfeedShowDataByTVDBId(tvdbId).success(function(sfShowData) {
								var sfSeriesId   = sfShowData.id;
								var sfSeriesName = sfShowData.name;
								var sfSeriesSlug = sfShowData.slug;
								var sfSeriesUrl  = 'http://www.seriesfeed.com/series/';

								addSeriesfeedFavouriteByShowId(sfSeriesId).success(function(result) {
									var resultStatus = result.status;
									var item = "<tr></tr>";
									var status = "-";
									var showUrl = sfSeriesUrl + sfSeriesSlug;
									
									if (sfSeriesId === -1) {
										sfSeriesId = "Onbekend";
									}
									
									if (!sfSeriesName) {
										showUrl = bdShowUrl + bdShowSlug;
										sfSeriesName = bdShowName;
									}

									if (resultStatus === "success") {
										status = "Toegevoegd als favoriet.";
										item = '<tr><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
									} else if (resultStatus === "failed" && sfSeriesId === "Onbekend") {
										status = '<a href="' + sfSeriesUrl + 'voorstellen/" target="_blank">Deze serie staat nog niet op Seriesfeed.</a>';
										item = '<tr class="row-warning"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
									} else {
										status = "Deze serie is mogelijk al een favoriet en is dus ongewijzigd.";
										item = '<tr class="row-info"><td>' + sfSeriesId + '</td><td><a href="' + showUrl + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
									}
									
									favourites.append(item);

									var progress = (index/bdFavouritesLength) * 100;
									progressBar.css('width', Math.round(progress) + "%");

									resolve();
								}).error(function(error) {
									console.log("Could not connect to Seriesfeed to favourite series " + sfSeriesName + " with id " + sfSeriesId + ".");
									var status = "Kon deze serie niet als favoriet instellen.";
									var item = '<tr class="row-error"><td>' + sfSeriesId + '</td><td><a href="' + sfSeriesUrl + sfSeriesSlug + '" target="_blank">' + sfSeriesName + '</a></td><td>' + status + '</td></tr>';
									favourites.append(item);

									var progress = (index/bdFavouritesLength) * 100;
									progressBar.css('width', Math.round(progress) + "%");
									
									resolve();
								});
							}).error(function(error) {
								console.log("Could not connect to Seriesfeed to convert TVDB id " + tvdbId + ".");
								var status = 'Kon geen verbinding met Seriesfeed maken om het id op te halen.</a>';
								var item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
								favourites.append(item);

								var progress = (index/bdFavouritesLength) * 100;
								progressBar.css('width', Math.round(progress) + "%");

								resolve();
							});
						}, function(error) {
							console.log("Could not connect to Bierdopje to get the TVDB of " + bdShowName + ".");
							var status = 'Deze serie kan niet gevonden worden op Bierdopje.';
							var item = '<tr class="row-error"><td>Onbekend</td><td><a href="' + bdShowUrl + bdShowSlug + '" target="_blank">' + bdShowName + '</a></td><td>' + status + '</td></tr>';
							favourites.append(item);

							var progress = (index/bdFavouritesLength) * 100;
							progressBar.css('width', Math.round(progress) + "%");

							resolve();
						});
					});
				}
				
				var MAX_ASYNC_CALLS = 3;
				var current_async_calls = 0;

				Promise.resolve(1).then(function loop(i) {
					if (current_async_calls < MAX_ASYNC_CALLS) {
						if (i < bdFavouritesLength) {
							current_async_calls += 1;
							getBierdopjeFavourite(i).then(function() {
								current_async_calls -= 1;
							});
							return loop(i + 1);
						}
					} else {
						return new Promise(function(resolve) {
							setTimeout(function() {
								resolve(loop(i));
							}, 80);
						});
					}
				}).then(function() {
					function checkActiveCalls() {
						if(current_async_calls === 0) {
							favImportBtn.prop('disabled', false);
							favImportBtn.attr('value', "Favorieten Importeren");
							outerProgress.removeClass('progress');
							progressBar.replaceWith("Importeren voltooid.");
						} else {
							setTimeout(checkActiveCalls, 80);
						}
					}

					checkActiveCalls();
				}).catch(function(error) {
					console.log("Unknown error: ", error);
				});
			}, function(error) {
                console.log("Could not connect to Bierdopje to get your favourites.");
				window.alert('Kan geen favorieten vinden voor ' + username + '. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.');
			});
		});
	}

	function getCurrentBierdopjeUsername() {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/stats",
				onload: function(bdStatsPageData) {
					var bdStatsData  = $('<div></div>').html(bdStatsPageData.responseText);
					var username = bdStatsData.find('#userbox_loggedin').find('h4').html();
					resolve(username);
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
	
	function getTVDBIdByBierdopjeShowSlug(showSlug) {
		return new Promise(function(resolve, reject) {
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com" + showSlug,
				onload: function(bdFavouritePageData) {
					var bdFavouriteData = $('<div></div>').html(bdFavouritePageData.responseText);
					var tvdbId = bdFavouriteData.find('a[href^="http://www.thetvdb.com"]').html();
                    resolve(tvdbId);
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
});
