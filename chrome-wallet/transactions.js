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
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Testnet',
      currencySymbol: 'TEST',
      coinTypeCode: '1\'',
      coinType: 1,
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
      dust: 1e8,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Reddcoin',
      currencySymbol: 'RDD',
      coinTypeCode: '4\'',
      coinType: 4,
      dust: 1e8,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Dash',
      currencySymbol: 'DASH',
      coinTypeCode: '5\'',
      coinType: 5,
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Namecoin',
      currencySymbol: 'NMC',
      coinTypeCode: '7\'',
      coinType: 7,
      dust: 1e4,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Groestlcoin',
      currencySymbol: 'GRS',
      coinTypeCode: '17\'',
      coinType: 17,
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
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Monacoin',
      currencySymbol: 'MONA',
      coinTypeCode: '22\'',
      coinType: 22,
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Vertcoin',
      currencySymbol: 'VTC',
      coinTypeCode: '28\'',
      coinType: 28,
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Syscoin',
      currencySymbol: 'SYS',
      coinTypeCode: '57\'',
      coinType: 57,
      dust: 3000,
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
      dust: 1,
      decimals: 18,
      amountParameters:
      {
        DECIMAL_PLACES: 18,
        EXPONENTIAL_AT: [-19, 9]
      }
    },
    {
      name: 'Fujicoin',
      currencySymbol: 'FJC',
      coinTypeCode: '75\'',
      coinType: 75,
      dust: 3000,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Pivx',
      currencySymbol: 'PIVX',
      coinTypeCode: '119\'',
      coinType: 119,
      dust: 3000,
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
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Firo',
      currencySymbol: 'FIRO',
      coinTypeCode: '136\'',
      coinType: 136,
      dust: 3000,
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
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'SmartCash',
      currencySymbol: 'SMART',
      coinTypeCode: '224\'',
      coinType: 224,
      dust: 3000,
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
      dust: 546,
      decimals: 8,
      amountParameters:
      {
        DECIMAL_PLACES: 8
      }
    },
    {
      name: 'Qtum',
      currencySymbol: 'QTUM',
      coinTypeCode: '2301\'',
      coinType: 2301,
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
    },
    {
      name: 'FOX',
      currencySymbol: 'FOX',
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
      a.showAnotherPage = function(p)
      {
        if (p < 1 || a.wallet.pages < p) return
        if (a.wallet.page === p) return
        a.wallets.length = 0;
        c.getTransactionHistory(b.walletId, b.subAccountType, p)
      },
      a.adjustprefix = function(addr)
      {
        return a.wallet.coinType === "Ethereum"
             ? addr.replace(/^([A-Fa-f0-9]{40})$/, "0x$1")
             : addr.replace("bitcoincash:", "")
      },
      a.$watch('wallets.length', function()
      {
        a.wallet = c.getWalletById(b.walletId, b.subAccountType)
      })
  }]),
  angular.module('kkTransactions').directive('foldable', function()
  {
    return {
      restrict: 'A',
      scope:
      {
        foldable: '='
      },
      link: function(scope, element, attrs)
      {
        let addrcount = scope.foldable
        if (addrcount < 3) return

        let expanded = false
        let rowHeight = 17.14

        element.addClass('foldable')
        element.bind('dblclick', function()
        {
          let slider = angular.element(element[0].querySelector('.foldslider .fa'))
          let rows = (expanded ? 3 : addrcount) * rowHeight
          element.css(
          {
            'max-height': (rows + 12) + 'px',
          })
          slider.addClass(expanded ? 'fa-angle-down' : 'fa-angle-up')
          slider.removeClass(expanded ? 'fa-angle-up' : 'fa-angle-down')
          expanded ^= 1
        })
      }
    }
  }),
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
    a.put('app/transactions/transaction.tpl.html', '<div class=transaction-list ng-controller=TransactionListController><header><div class="logo upper-left-logo"></div><h1><div class="wallet-title">{{wallet.name}} ({{wallet.coinType}})</div><div class="page-nav fa fa-chevron-first" ng-click="showAnotherPage(1)" ng-class="{disabled:wallet.page === 1}"></div><div class="page-nav fa fa-chevron-prev" ng-click="showAnotherPage(wallet.page - 1)" ng-class="{disabled:wallet.page === 1}"></div><div class="page-nav">{{wallet.page}} / {{wallet.pages}}</div><div class="page-nav fa fa-chevron-next" ng-click="showAnotherPage(wallet.page + 1)" ng-class="{disabled:wallet.page === wallet.pages}"></div><div class="page-nav fa fa-chevron-last" ng-click="showAnotherPage(wallet.pages)" ng-class="{disabled:wallet.page === wallet.pages}"></div></h1><h5 ng-hide="wallet.accountNumber===undefined">Account #{{wallet.accountNumber}}</h5><div class=table><div class=thead><div class=date>Date</div><div class=time>Time</div><div class=address>Address</div><div class=amount>Amount</div><div class=amount>Network Fee</div><div class=link></div></div></div></header><section><div class=table><notification></notification><div class=transaction ng-class="{\'odd\': $odd, \'even\': $even}" ng-repeat="transaction in wallet.txHist | orderBy:\'-date\'"><div class=date>{{transaction.date | date:\'mediumDate\' }}</div><div class=time>{{transaction.date | date:\'hh:mm:ss a\'}}</div><div class=address foldable="transaction.addresses.length"><div ng-repeat="address in transaction.addresses track by $index">{{adjustprefix(address)}}</div><div class="foldslider" ng-if="transaction.addresses.length > 3"><span class="fa fa-angle-down"></span></div></div><div class=amount><div class=received hide-if-zero=transaction.amountReceived>+&nbsp;<formatted-amount amount=transaction.amountReceived currency=wallet.coinType suppress-symbol=true></formatted-amount></div><div class=sent hide-if-zero=transaction.amountSent>-&nbsp;<formatted-amount amount=transaction.amountSent currency=wallet.coinType suppress-symbol=true></formatted-amount></div></div><div class=amount><div hide-if-zero=transaction.fee>-&nbsp;<formatted-amount amount=transaction.fee currency=wallet.coinType suppress-symbol=true></formatted-amount></div></div><div class=link><a href={{transaction.link}} target=_blank><span class="fa fa-instantsend" ng-show=transaction.instantLocked></span><span ng-show=!transaction.pending>details</span> <span ng-show=transaction.pending>unconfirmed</span></a></div></div></div></section></div>')
  }]);
