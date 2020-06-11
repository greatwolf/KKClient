# ![KKClient Logo](/images/icon.png) KKClient

A simple cryptocurrency wallet that integrates with the KeepKey device.

This fork is an attempt to continue support and improve upon the original KeepKey Chrome Extension. The code is based off of Shapeshift's last original release of the KeepKey Client found in [Google's chrome web store](https://keepkey.zendesk.com/hc/en-us/articles/360001411570-Getting-Started-Initializing-Your-KeepKey-Device).

## Motivation

This project and fork was born out of frustration with how Shapeshift has handled support and maintenance of this very important extension. This extension is one of the few ways that allows the end-user to access the crypto on his/her hardware wallet without having to install full blown node software for each coin.

Shapeshift has been pushing users away from using this extension and onto their platform. The original extension hasn't received any meaningful updates for a long time. Connectivity and access to it are spotty at times due to server outages(eg. coinquery.com). When this happens the extension will fail to load properly making it nonfunctional.

Unfortunately, Shapeshift.com is not a dropin replacement for the chrome extension since not all features and cryptos are supported (eg. BitcoinGold, BitcoinSV etc.) and some users prefer not to be at the mercy of Shapeshift's platform just to access their own crypto.

This project is a best-effort attempt at trying to rectify that problem.

## How To Use

 - Install the latest version of the original KeepKey Client. See [instructions here](https://keepkey.zendesk.com/hc/en-us/articles/360001411570-Getting-Started-Initializing-Your-KeepKey-Device).
 - Download the [zip file](https://github.com/greatwolf/KKClient/archive/master.zip) for this repo.
 - Extract the files into the browser extension's path(eg. ../Extensions/idgiipeogajjpkgheijapngmlbohdhjg/6.4.0.1_0) replace and overwrite any existing files.
 - Open the browser and goto `chrome://extensions`. Click on `Load Unpacked` on the upper left corner.
 - Find the extension path '../Extensions/idgiipeogajjpkgheijapngmlbohdhjg/6.4.0.1_0' and click `Select Folder` to reload the extension.
 - Finally start the extension by going to `chrome://apps`.
