// ==UserScript==
// @name         Seriesfeed Import
// @namespace    http://www.seriesfeed.com
// @version      1.0
// @description  Allows you to import your favourites from Bierdopje.com.
// @match        http://www.seriesfeed.com/*
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
'use strict';

$(function() {
    // Add menu item to navigator.
    $('.nav .dropdown .dropdown-menu:eq(2)').append('<li><a href="/series/import/">Importeren</a></li>');
    
    if (window.location.href === "http://www.seriesfeed.com/series/import/") {
		var wrapper   = $('.wrapper');
		wrapper.removeClass('show padding');
		
		var container = $('.wrapper .container').html('');
		var row       = $(document.createElement("div"));
		var col       = $(document.createElement("div"));
        var head      = $(document.createElement("h1"));
		var p         = $(document.createElement("p"));
		
		row.addClass("row");
		col.addClass("col-md-12");
		
		container.append(row);
		row.append(col);
		col.append(head);
		col.append(p);
		
		head.append('Series importeren');
        p.append('Kies een platform:');
		
		var bierdopje = createPlatform("Bierdopje.com", "http://cdn.bierdopje.eu/g/layout/bierdopje.png", "bierdopje/");
		bierdopje.addClass('wow fadeInUp cardStyle cardForm formBlock animated');
		p.after(bierdopje);
    }
	
	if (window.location.href === "http://www.seriesfeed.com/series/import/bierdopje/") {
		var currentUser = getCurrentUser();
        var head = $('.col-md-12 h1').html('');
		var p    = $('.col-md-12 p').html('');
		
		var formElement   = $(document.createElement("div"));
		var usernameInput = $('<div><input type="text" id="username" class="form-control" placeholder="Gebruikersnaam" value="' + currentUser + '" /></div>');
		var submitInput   = $('<div><input type="button" id="fav-import" class="btn btn-success btn-block" value="Favorieten Importeren" /></div>');
		var progressBar   = $('<progress value="0" max="100"></progress>');
		var bottomPane    = $('<div class="blog-left"></div>');
		var detailsTable  = $('<table class="table table-hover responsiveTable favourites stacktable large-only" id="details" style="display: none;">');
		var detailsHeader = $('<tr><th style="padding-left: 30px;">Id</th><th>Naam</th><th>Status</th></tr>');
		var showDetails   = $('<div class="blog-content" id="details-content"><input type="button" id="show-details" class="btn btn-block" value="Details" /></div>');
		
		formElement.addClass('blog-left wow fadeInUp cardStyle cardForm formBlock animated');
		bottomPane.addClass('wow fadeInLeft cardStyle animated');
		detailsTable.addClass('wow fadeInLeft cardStyle animated');
		formElement.css('padding', '10px');
		progressBar.css({
			'margin-top': '15px',
			'background-color': '#f3f3f3',
			'border': '0',
			'height': '18px',
			'width': '100%'
		});
		
		head.append('Series importeren - Bierdopje.com');
        p.append('Voer je gebruikersnaam in en klik op de knop "Favorieten Importeren"');
		
		formElement.append(usernameInput);
		formElement.append(submitInput);
		p.after(formElement);
		detailsTable.append(detailsHeader);
		bottomPane.append(showDetails);
		showDetails.append(detailsTable);
		
		$("#fav-import").click(function() {
			var favImportBtn = $(this);
			favImportBtn.prop('disabled', true);
			favImportBtn.attr('value', "Bezig met importeren...");
			formElement.append(progressBar);
			formElement.after(bottomPane);

			var username = $('#username').val();
			var favourites = $('#details');
			
			$("#show-details").click(function() {
				detailsTable.toggle();
			});
			
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.bierdopje.com/users/" + username + "/shows",
				onload: function(response) {
					var div     = $('<div></div>');
					div.html(response.responseText);
					var links   = div.find('.content').find('ul').find('li').find('a');
					var length  = links.length;
					var current = 1;
					
					links.each(function() {
						var showName = cleanShowName($(this).html());
						var showSlug = getShowSlugByShowName(showName);
						
						getShowIdByShowSlug(showSlug).success(function (result) {
							var showId = result.id;
							
							addShowFavouriteByShowId(showId).success(function (result) {
								var status = "-";
								
								if (showId === -1) {
									showId = "Onbekend";
								}

								if (result.status === "success") {
									status = "Toegevoegd als favoriet."
								} else if (result.status === "failed" && showId === "Onbekend") {
									status = '<a href="http://www.seriesfeed.com/series/voorstellen/">Deze serie staat nog niet op Seriesfeed.</a>';
								} else {
									status = "Deze serie kan niet toegevoegd worden. Mogelijk is deze serie al een favoriet.";
								}

								var item = '<tr><td>' + showId + '</td><td><a href="http://www.seriesfeed.com/series/' + showSlug + '">' + showName + '</a></td><td>' + status + '</td></tr>';
								favourites.append(item);

								var progress = (current/length) * 100;
								progressBar.attr('value', Math.round(progress));

								if (current++ === length) {
									favImportBtn.prop('disabled', false);
									favImportBtn.attr('value', "Favorieten Importeren");
									progressBar.replaceWith("Importeren voltooid.");
								}
							});
						});
					});
				}
			});
		});
	}
	
	function createPlatform(name, image, url) {
		return $('<div class="portfolio mix_all" style="display: inline-block;  opacity: 1;">'
				 + '<a href="' + url + '">'
    		         + '<div class="portfolio-wrapper cardStyle">'
	    			     + '<div class="portfolio-hover">'
		    			     + '<img src="' + image + ' " alt="' + name + '">'
			    	     + '</div>'
				         + '<div class="portfolio-info">'
					         + '<div class="portfolio-title">'
				                 + '<h4>' + name + '</h4>'
					         + '</div>'
    				     + '</div>'
	    		     + '</div>'
				 + '</a>'
		     + '</div>');
	}
	
	function getCurrentUser() {
		var user = $('.nav .dropdown .dropdown-menu:eq(1) li a').attr('href').replace("/user/", "");
		user = user.replace("/", "");
		
		return user;
	}
	
	function cleanShowName(showName) {
		showName = showName.replace("<del>", "");
		showName = showName.replace("</del>", "");

		return showName;
	}

	function getShowSlugByShowName(showName) {
		showName = showName.toLowerCase();
		showName = showName.replace(/\&/g, "and");                 // Convert & to and.
		showName = showName.replace(/ \([0-9]+\)/g, "");           // Trim space ( ) (year).
		showName = showName.replace(/([0-9])\.([0-9])/g, "$1-$2"); // Replace . with - only when surrounded by numbers.
		showName = showName.replace(/ /g, "-");                    // Replace space ( ) with -
		showName = showName.replace(/[^a-z0-9\-]/g, "");           // Trim special chars like ! and ', but not -.

		return showName;
	}

	function getShowIdByShowSlug(showSlug) {
		return $.ajax({
			type: "POST",
			url: "/ajax.php?action=getShowId",
			data: {slug: showSlug},
			dataType: "json"
		});
	}
	
	function addShowFavouriteByShowId(showId) {
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