# ![KKClient Logo](/images/icon.png) KKClient

[![Release downloads](https://img.shields.io/github/downloads/greatwolf/KKClient/total?cacheSeconds=600)](https://github.com/greatwolf/KKClient/releases)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

A simple cryptocurrency wallet that integrates with the KeepKey device.

This fork is an attempt to continue support and improve upon the original KeepKey Chrome Extension. The code is based off of Shapeshift's last original release of the KeepKey Client found in [Google's Chrome App store](https://chrome.google.com/webstore/detail/keepkey-client/idgiipeogajjpkgheijapngmlbohdhjg).

## Motivation

This project and fork was born out of frustration with how Shapeshift has handled support and maintenance of this very important extension. This extension is one of the few ways that allows the end-user to access the crypto on his/her hardware wallet without having to install full blown node software for each coin.

Shapeshift has been pushing users away from using this extension and onto their platform. The original extension hasn't received any meaningful updates for a long time. Connectivity and access to it are spotty at times due to server outages(eg. coinquery.com). When this happens the extension will fail to load properly making it nonfunctional.

Unfortunately, Shapeshift.com is not a dropin replacement for the chrome extension since not all features and cryptos are supported (eg. BitcoinGold, BitcoinSV etc.) and some users prefer not to be at the mercy of Shapeshift's platform just to access their own crypto.

This project is a best-effort attempt at trying to rectify that problem.

## Features & Fixes

This fork contains numerous improvements and bugfixes over the original client. Here's a non-exhaustive list:

 - Lower transaction fee when sending altcoins
 - Use btc-fee.net for cheaper btc fee estimation
 - Display USD equivalent value in wallet
 - Migrated to trezor's blockbook indexer away from insight's deprecated api
 - Show cashaddr format for BCH transaction history
 - Allow PIN input from keyboard's numpad
 - Fixed PIN/Passphrase transitional issues in send & receive
 - Fixed a bug in how the client handles multibyte prefixes when generating base58 addresses from xpub
 - Provide user configurable cloud store to google's firebase or api.blockcypher.com
  (necessary to workaround KeepKey's defunced `blockcypherMasterApiToken`)
 - Fixed detection issue where sometimes KeepKey isn't detected when plugged in
 - Fixed css styling for wallet balances so it no longer wraps on long digits
 - Implemented a better PIN retry mechanism
 - Allow BIP39 seed length selection when initializing KeepKey
 - Removed Shapeshift advert overlay during startup load
 - Nicer looking cryptocurrency icon design courtesy of cryptoicons.co project
 - Use gasnow.org for Ethereum gas price estimation
 - Viewable BIP44 XPub Address and QR code for a given wallet

Altcoin Support:

 - Bitcoin TESTNET
 - BitcoinSV
 - BitcoinGold
 - DigiByte
 - Zcash (supports unshielded addresses only)
 - Komodo
 - Ravencoin
 - Qtum
 - Groestlcoin
 - Vertcoin
 - Fujicoin
 - Syscoin*
 - Pivx*
 - Reddcoin*
 - Firo* (supports unshielded addresses only)
 - SmartCash*

<sub>*Requires [custom firmware](https://github.com/greatwolf/keepkey-firmware/tree/build-release) support.</sub>

## How To Use

There are two ways to install this extension onto a Chromium-based browser(eg. such as Brave), either by getting one of the tagged versions under the [release section](https://github.com/greatwolf/KKClient/releases) or directly from source repo. Using the release is a bit easier since it contains all the files necessary for the extension to function as well as skipping the optional step of setting up an api token for the metadata cloud store. The instructions below will assume Chome is being used. Adjust the directory and locations as needed for your setup.

### From Release
 - Download the latest KKClient-*x.x.x*.zip file in the [release section](https://github.com/greatwolf/KKClient/releases/latest).
 - Extract the files into your location of choice or into Chrome's default extension path(eg. ../Google/Chrome/Userdata/Default/Extensions/idgiipeogajjpkgheijapngmlbohdhjg).
 - Open Chrome and goto `chrome://extensions`. Make sure `developer mode` is toggled on.
 - Click on the `Load Unpacked` button on the upper left corner.
 - Navigate into the directory of where you extracted the extension, click `Select Folder` to load the extension.
 - Start the extension by going to `chrome://apps`.
 - Recreate any missing wallets by using `Add Account`.
 
### From Source
 - Install the latest version of the original KeepKey Client. See [instructions here](https://keepkey.zendesk.com/hc/en-us/articles/360001411570-Getting-Started-Initializing-Your-KeepKey-Device).
 - Download the [zip file](https://github.com/greatwolf/KKClient/archive/master.zip) for this repo.
 - Extract the files into Chrome's extension path(eg. ../Extensions/idgiipeogajjpkgheijapngmlbohdhjg/6.4.0.1_0) replace and overwrite any existing files.
 - Open Chrome and goto `chrome://extensions`. Make sure 'developer mode' is toggled on.
 - Click on the `Load Unpacked` button on the upper left corner.
 - Find the extension path '../Extensions/idgiipeogajjpkgheijapngmlbohdhjg/6.4.0.1_0' and click `Select Folder` to reload the extension.
 - Setup a blockcypher API access token at [blockcypher.com](https://blockcypher.com).
 - Open 'apitokens.js' file in a text editor. At the top of the file copy the API access token from the previous step into the `METADATA_API_TOKEN` variable and save. For example,
 
        var METADATA_API_TOKEN = "d9a5e85023faa87914a191f6a741a2c4";
        // The line above is only for illustration and is not a valid api token!
        // Copy + paste the token you created there.
     
 - Finally start the extension by going to `chrome://apps`.
 - Recreate any missing wallets by using `Add Account`.

## License

Since this fork is based off of KeepKey's original ChromeApp codebase, it inherits the same LGPLv3 license as well. See [keepkey/chrome-proxy](https://github.com/keepkey/chrome-proxy/blob/a33af2ccd300b0580a0fab793aae82049402695d/src/background.js#L4).
