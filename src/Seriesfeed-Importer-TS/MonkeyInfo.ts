// ==UserScript==
// @name         Seriesfeed Importer
// @namespace    https://www.seriesfeed.com
// @version      3.0-dev
// @description  Allows you to import your favourites from Bierdopje.com.
// @match        https://*.seriesfeed.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      www.bierdopje.com
// @connect      www.imdb.com
// @domain       www.bierdopje.com
// @domain       www.imdb.com
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2016 - 2017, Tom
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_xmlhttpRequest, Promise, console */
'use strict';
