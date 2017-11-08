# Seriesfeed Importer
Import your favourites from other sites like Bierdopje.com to Seriesfeed.com
<BR/>
Enjoy.
<BR/><BR/>
Version <strong>2.3.1</strong>

<A HREF="https://github.com/TomONeill/Seriesfeed-Importer/raw/master/SeriesfeedImport.user.js">INSTALL</A>

# Information
With this userscript, you can import your favourites from Bierdopje.com to Seriesfeed.com.<BR />
Your username will be filled in automatically if you are logged onto Bierdopje.com. You can use any username you like, however. After clicking the Import button, your favourites are being imported into Seriesfeed. In the Details table, rows are being given a colour if there is something about that series. Blue rows will indicate you most likely already have that series as a favourite on Seriesfeed. Yellow ones indicate the series does not exist on Seriesfeed yet and red ones indicate that an error has happened while connecting Bierdopje or Seriesfeed. You can always try again to see if it works the second time.

# Screenshots
<img src="https://raw.githubusercontent.com/TomONeill/Seriesfeed-Importer/master/Screenshots/v1.1-1.png" alt="Version 2.2" width="250px" />
<img src="https://raw.githubusercontent.com/TomONeill/Seriesfeed-Importer/master/Screenshots/v2.0-2.png" alt="Version 2.2" width="250px" />

# Changelog
<A HREF="https://raw.githubusercontent.com/TomONeill/Seriesfeed-Importer/master/Changelog.txt">View changelog</A>

# Other userscripts
Check out other userscripts for Seriesfeed by me:<BR/>
<ul>
    <li><A HREF="https://github.com/TomONeill/Seriesfeed-Import-Time-Wasted">Import Time Wasted</A></li>
    <li><A HREF="https://github.com/TomONeill/Seriesfeed-Move">Move cards on frontpage</A></li>
    <li><A HREF="https://github.com/TomONeill/Seriesfeed-Season-Separator">Season Separator</A></li>
</ul>

# Development
If you want to help with the development, you can. From now on I'll be working in the `src/Seriesfeed-Importer-TS` directory, in which a TypeScript project is located. You can use this for development. To setup the dev in combination with Tampermonkey/other, do the following:
1. Open the `src/Seriesfeed-Importer-TS` folder in your favourite IDE.
2. Open CMD, PowerShell or the terminal (VS Code tip: use CTRL + `).
2.5: If not already, `cd` to this repository.
3. Type: `tsc --watch` to run the TypeScript compiler. The `tsconfig.json` file will determine the location of the output.
4. Add a userscript with the following:
```
	// ==UserScript==
	// @name         Seriesfeed Importer
	// @namespace    https://www.seriesfeed.com
	// @version      3.0-dev
	// @description  Import your favourites and Time Wasted from Bierdopje.com.
	// @match        https://*.seriesfeed.com/*
	// @grant        unsafeWindow
	// @grant        GM_xmlhttpRequest
	// @connect      www.bierdopje.com
	// @connect      www.imdb.com
	// @domain       www.bierdopje.com
	// @domain       www.imdb.com
	// @require      https://code.jquery.com/jquery-3.2.1.min.js
	// @require      file://{YOUR_CLONE}\Seriesfeed-Importer\src\Seriesfeed-Importer-TS\SeriesfeedImport.user.js
	// @author       Tom
	// @copyright    2016 - 2017, Tom
	// ==/UserScript==
	/* jshint -W097 */
	/* global $, GM_xmlhttpRequest, Promise, console */
	'use strict';
```
5. Make sure you have ticked the box `Allow access to file URLs` for the Tampermonkey extension.

Any change will compile (some would say transpile) and a browser refresh will do the rest.

# Donate
If you like my work so much you feel like doing something nice for me, a complete stranger of the internet, you can.<BR />
<A HREF="https://www.paypal.me/TomONeill">Donate here</A>.
