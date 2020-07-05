'use strict';
angular.module('kkTransactions', ['ngRoute', 'kkCommon', 'ui.bootstrap']).config(['$compileProvider', function(a)
  {
    a.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/)
  }]).run(['CurrencyLookupService', function(a)
  {
    a.set([
    {
      name: 'Bitcoin',
      currencySymbol: 'BTC',
      coinTypeCode: '0\'',
      coinType: 0,
      addressFormat: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Litecoin',
      currencySymbol: 'LTC',
      coinTypeCode: '2\'',
      coinType: 2,
      addressFormat: '^L[a-km-zA-HJ-NP-Z1-9]{26,33}$',
      dust: 1e5,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Dogecoin',
      currencySymbol: 'DOGE',
      coinTypeCode: '3\'',
      coinType: 3,
      addressFormat: '^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$',
      dust: 1e8,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Ethereum',
      currencySymbol: 'ETH',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Dash',
      currencySymbol: 'DASH',
      coinTypeCode: '5\'',
      coinType: 5,
      addressFormat: '^X[a-km-zA-HJ-NP-Z1-9]{25,34}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'DigiByte',
      currencySymbol: 'DGB',
      coinTypeCode: '20\'',
      coinType: 20,
      addressFormat: '^D\\w{33}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'BitcoinCash',
      currencySymbol: 'BCH',
      coinTypeCode: '145\'',
      coinType: 145,
      addressFormat: '(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^bitcoincash:[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{25,55}$)|(^bitcoincash:[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{25,55}$)',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'BitcoinSV',
      currencySymbol: 'BSV',
      coinTypeCode: '236\'',
      coinType: 236,
      addressFormat: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'BitcoinGold',
      currencySymbol: 'BTG',
      coinTypeCode: '156\'',
      coinType: 156,
      addressFormat: '^[AG][a-km-zA-HJ-NP-Z1-9]{25,34}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Komodo',
      currencySymbol: 'KMD',
      coinTypeCode: '141\'',
      coinType: 141,
      addressFormat: '^R\\w{33}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Ravencoin',
      currencySymbol: 'RVN',
      coinTypeCode: '175\'',
      coinType: 175,
      addressFormat: '^R\\w{33}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Zcash',
      currencySymbol: 'ZEC',
      coinTypeCode: '133\'',
      coinType: 133,
      addressFormat: '^t1[a-km-zA-HJ-NP-Z1-9]{33}$',
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Aragon',
      currencySymbol: 'ANT',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Augur',
      currencySymbol: 'REP',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'BAT',
      currencySymbol: 'BAT',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Civic',
      currencySymbol: 'CVC',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'EOS',
      currencySymbol: 'EOS',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Golem',
      currencySymbol: 'GNT',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Gnosis',
      currencySymbol: 'GNO',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'OmiseGo',
      currencySymbol: 'OMG',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'district0x',
      currencySymbol: 'DNT',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'FunFair',
      currencySymbol: 'FUN',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'SALT',
      currencySymbol: 'SALT',
      coinTypeCode: '60\'',
      coinType: 60,
      addressFormat: '^(0x)?[0-9a-fA-F]{40}$',
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    }])
  }]).controller('TransactionListController', ['$scope', '$routeParams', 'WalletNodeService', function(a, b, c)
  {
    c.getTransactionHistory(b.walletId, b.subAccountType),
      a.wallets = c.wallets,
      a.$watch('wallets.length', function()
      {
        a.wallet = c.getWalletById(b.walletId, b.subAccountType)
      })
  }]),
  angular.module('kkTransactions').config(['DeviceBridgeServiceProvider', function(a)
  {
    a.when('disconnected', ['WalletNodeService', function(a)
      {
        a.clear(),
          chrome.app.window.current().close()
      }]),
      a.when('TransactionHistory', ['WalletNodeService', function(a)
      {
        a.updateWalletHistory(this.request.message)
      }]),
      a.when('unknownSender', function()
      {
        this.sendResponse(
        {
          messageType: 'Error',
          result: 'Unknown sender ' + this.sender.id + ', message rejected'
        })
      }),
      a.when('unknownMessageType', function()
      {
        this.sendResponse(
        {
          messageType: 'Error',
          result: 'Unknown messageType ' + this.request.messageType + ', message rejected'
        })
      })
  }]),
  angular.module('kkTransactions').config(['$routeProvider', function(a)
  {
    a.caseInsensitiveMatch = !0,
      a.when('/:walletId',
      {
        templateUrl: 'app/transactions/transaction.tpl.html',
        goable: !0
      }).when('/:walletId/:subAccountType',
      {
        templateUrl: 'app/transactions/transaction.tpl.html',
        goable: !0
      }).otherwise(
      {
        redirectTo: '/'
      })
  }]),
  angular.module('kkTransactions').run(['$templateCache', function(a)
  {
    a.put('app/transactions/transaction.tpl.html', '<div class=transaction-list ng-controller=TransactionListController><header><div class="logo upper-left-logo"></div><h1>{{wallet.name}} ({{wallet.coinType}})</h1><h5 ng-hide="wallet.accountNumber===undefined">Account #{{wallet.accountNumber}}</h5><div class=table><div class=thead><div class=date>Date</div><div class=time>Time</div><div class=address>Address</div><div class=amount>Amount</div><div class=amount>Network Fee</div><div class=link></div></div></div></header><section><div class=table><notification></notification><div class=transaction ng-repeat="transaction in wallet.txHist | orderBy:\'-date\'"><div class=date>{{transaction.date | date:\'shortDate\' }}</div><div class=time>{{transaction.date | date:\'mediumTime\'}}</div><div class=address><div ng-repeat="address in transaction.addresses track by $index">{{address}}</div></div><div class=amount><div class=received hide-if-zero=transaction.amountReceived>+&nbsp;<formatted-amount amount=transaction.amountReceived currency=wallet.coinType suppress-symbol=true></formatted-amount></div><div class=sent hide-if-zero=transaction.amountSent>-&nbsp;<formatted-amount amount=transaction.amountSent currency=wallet.coinType suppress-symbol=true></formatted-amount></div></div><div class=amount><div hide-if-zero=transaction.fee>-&nbsp;<formatted-amount amount=transaction.fee currency=wallet.coinType suppress-symbol=true></formatted-amount></div></div><div class=link><a href={{transaction.link}} target=_blank><span ng-show=!transaction.pending>details</span> <span ng-show=transaction.pending>unconfirmed</span></a></div></div></div></section></div>')
  }]);
