// ==UserScript==
// @name         Seriesfeed Import
// @namespace    http://www.seriesfeed.com
// @version      0.1
// @description  Allows you to import your favourites from Bierdopje.com.
// @match        http://www.seriesfeed.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://code.jquery.com/jquery-1.12.2.min.js
// @require      http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @author       Tom
// @copyright    2016+, Tom
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function() {
    // Add menu item to navigator.
    $('.nav .dropdown .dropdown-menu:eq(1)').append('<li><a href="/main/import/">Importeren</a></li>');
    
    if (window.location.href.indexOf("main/import") > -1) {
        $('body').html('<h3 id="type">Favorieten van Bierdopje.com importeren</h3><br/><input type="text" id="username" placeholder="Gebruikersnaam" /><button id="fav-import">Importeren</button><br/><br/><ul id="favourites"></ul>');
        
        $( "#fav-import" ).click(function() {
            var username = $('#username').val();
            var favourites = $('#favourites');
            
            var API_URL = 'http://127.0.0.1:8080/api';
            $.getJSON(API_URL + '/Bierdopje/GetFavoritesByUserName/' + username, function(fav) {
                fav.forEach(function(favItem) {
                
                    var showName = favItem.name;
                    var showUrl  = encodeString(showName);
                    
                    $.getJSON(API_URL + '/Seriesfeed/GetSeriesIdBySeriesUrl/' + showUrl, function(series) {
                        var seriesId = series[0].id;
                        var button, topshow, send;
                
                        send = {
                            series: seriesId,
                            type: 'favourite',
                            selected: '0'
                        };

                        $.ajax({
                            type: "POST",
                            url: "/ajax.php?action=updateFavourite",
                            data: send,
                            dataType: "json"
                        }).done(function (data) {
                            var item = '<li><a href="http://www.seriesfeed.com/series/' + showUrl + '">' + showName + '</a> (' + seriesId + ')</li>';
                            favourites.append(item);
                            
                            if (data.status === "success") {
                                favourites.append(" [OK]");
                            } else {
                                favourites.append(" [FAILED: " + data.errors + "]");
                            }
                            favourites.append("<br/>");
                        });
                    });
                });
            });
            
        });
    }
    
    function encodeString(string) {
        string = string.toLowerCase();
        string = string.replace(/\&/g, "and");                 // Convert & to and.
        string = string.replace(/ \([0-9]+\)/g, "");           // Trim space ( ) (year).
        string = string.replace(/([0-9])\.([0-9])/g, "$1-$2"); // Replace . with - only when surrounded by numbers.
        string = string.replace(/ /g, "-");                    // Replace space ( ) with -
        string = string.replace(/[^a-z0-9\-]/g, "");           // Trim special chars like ! and ', but not -.
        
        return string;
    }
});