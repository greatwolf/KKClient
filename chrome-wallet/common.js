'use strict';
angular.module('kkCommon', []).run(['DeviceBridgeService', 'environmentConfig', '$rootScope', function(a, b, c) {
    window.KeepKey = {
        enablePassphrase: function c(b) {
            _.isUndefined(b) && (b = !0),
            a.enablePassphrase({
                enabled: b
            })
        },
        enableFeeSelector: function d(a) {
            b.showFeeSelector = a,
            c.$apply()
        },
        enablePolicy: function d(b, c) {
            _.isUndefined(c) && (c = !0),
            a.enablePolicy({
                policyName: b,
                enabled: c
            })
        },
        deleteAccount: a.deleteAccount,
        DeviceBridge: a
    }
}
]),
angular.module('kkCommon').directive('exchangeFormattedAmount', function() {
    return {
        restrict: 'E',
        replace: !0,
        scope: {
            amount: '=',
            currency: '=',
            exchangeCurrencySymbol: '=?',
            hasExchangeRate: '=?',
            exchangeFormattedAmount: '=?'
        },
        controller: ['$scope', 'CurrencyLookupService', 'environmentConfig', 'SpotPriceService', function(a, b, c, spot) {
            a.currencySymbol = b.getCurrencySymbol(a.currency),
            angular.isDefined(a.exchangeFormattedAmount) || (a.exchangeFormattedAmount = '...'),
            angular.isDefined(a.exchangeCurrencySymbol) || (a.exchangeCurrencySymbol = 'USD');
            var d = function(fiat, crypto)
            {
                if (void 0 === fiat || void 0 === crypto) return

                spot.get(fiat, crypto)
                    .then(function(price)
                    {
                      if (!price) return

                      var e = b.formatAmount(a.currency, a.amount)
                      e *= price
                      a.exchangeFormattedAmount = e.toFixed(e < 0.01 ? 4 : 2)
                      a.hasExchangeRate = c.showFiatBalance,
                      a.$digest()
                    })
            }
            a.$watch('amount', d.bind(null, a.exchangeCurrencySymbol, a.currency))
        }
        ],
        templateUrl: 'app/common/directives/exchangeFormattedAmount.tpl.html'
    }
}),
angular.module('kkCommon').directive('formattedAmount', function() {
    return {
        restrict: 'E',
        replace: !0,
        scope: {
            amount: '=',
            currency: '=',
            signed: '=',
            suppressSymbol: '='
        },
        controller: ['$scope', 'CurrencyLookupService', function(a, b) {
            var formatValue = a.signed ? b.formatSignedAmount : b.formatAmount
            a.currencySymbol = b.getCurrencySymbol(a.currency),
            a.formattedAmount = formatValue(a.currency, a.amount),
            a.$watch('amount', function() {
                a.formattedAmount = formatValue(a.currency, a.amount)
            }),
            a.$watch('currency', function() {
                a.currencySymbol = b.getCurrencySymbol(a.currency)
            })
        }
        ],
        templateUrl: 'app/common/directives/formattedAmount.tpl.html'
    }
}),
angular.module('kkCommon').directive('hideIfZero', function() {
    return {
        restrict: 'A',
        link: function e(a, b, c) {
            var d;
            a.$watch(c.hideIfZero, function(a) {
                d = a instanceof BigNumber ? a.eq(0) : _.isString(a) ? !parseFloat(a) : !a,
                d ? b.addClass('ng-hide') : b.removeClass('ng-hide')
            })
        }
    }
}),
angular.module('kkCommon').factory('chrome', ['$window', function(a) {
    return a.chrome
}
]),
angular.module('kkCommon').provider('DeviceBridgeService', function() {
    var a = {};
    this.when = function(b, c) {
        a[b] = c
    }
    ,
    this.$get = ['$rootScope', '$q', 'chrome', 'environmentConfig', '$injector', function(b, c, d, e, f) {
        function g(a, b) {
            return 'passphrase' === a || 'pin' === a || 'character' === a ? '<redacted>' : b
        }
        function h(a) {
            return console.log('UI --> proxy:', JSON.stringify(a, g, 4)),
            c(function(b) {
                d.runtime.sendMessage(a, {}, b)
            })
        }
        function i(c, d, e) {
            console.log('proxy --> UI:', JSON.stringify(c, undefined, 4));
            var g = {
                request: c,
                sender: d,
                sendResponse: e
            };
            b.$broadcast(c.messageType, c.message);
            var h = a[c.messageType];
            return h ? void (f.invoke(h, g),
            b.$digest()) : void f.invoke(a.unknownMessageType, g)
        }
        return {
            startListener: function() {
                d.runtime.onMessage.addListener(i)
            },
            stopListener: function() {
                d.runtime.onMessage.removeListener(i)
            },
            isDeviceReady: function a() {
                return Promise.resolve(!1)
            },
            resetDevice: function c(a) {
                var b = angular.extend({
                    messageType: 'reset'
                }, a);
                return h(b)
            },
            pingDevice: function(msg) {
                return h({
                    messageType: 'Ping',
                    message: msg
                })
            },
            wipeDevice: function a() {
                return h({
                    messageType: 'Wipe'
                })
            },
            changePin: function c(a) {
                var b = angular.extend({
                    messageType: 'ChangePin'
                }, a);
                return h(b)
            },
            changePinTimeout: function c(a) {
                var b = angular.extend({
                    messageType: 'ChangePinTimeout'
                }, a);
                return h(b)
            },
            applySettings: function c(a) {
                var b = angular.extend({
                    messageType: 'ApplySettings'
                }, a);
                return h(b)
            },
            enablePassphrase: function c(a) {
                var b = angular.extend({
                    messageType: 'EnablePassphrase'
                }, a);
                return h(b)
            },
            enablePolicy: function c(a) {
                var b = angular.extend({
                    messageType: 'EnablePolicy'
                }, a);
                return h(b)
            },
            sendPin: function c(a) {
                var b = angular.extend({
                    messageType: 'PinMatrixAck'
                }, a);
                return h(b)
            },
            requestPinRetry: function a() {
                return h({
                    messageType: 'PinMatrixRetry'
                })
            },
            initialize: function a() {
                return h({
                    messageType: 'Initialize'
                })
            },
            initiateSession: function a() {
                return h({
                    messageType: 'InitiateSession'
                })
            },
            endSession: function a() {
                return h({
                    messageType: 'EndSession'
                })
            },
            cancel: function a() {
                return h({
                    messageType: 'Cancel'
                })
            },
            recoverDevice: function c(a) {
                var b = angular.extend({
                    messageType: 'RecoveryDevice'
                }, a);
                return h(b)
            },
            acknowledgeWord: function b(a) {
                return h({
                    messageType: 'WordAck',
                    word: a
                })
            },
            characterAck: function d(a, b, c) {
                return h({
                    messageType: 'CharacterAck',
                    character: a,
                    delete: b,
                    done: c
                })
            },
            updateDevice: function b(a) {
                return h({
                    messageType: 'FirmwareUpdate',
                    requestedUpdate: a
                })
            },
            getReceiveAddress: function c(a, b) {
                return h({
                    messageType: 'GetReceiveAddress',
                    account: a,
                    depth: b
                })
            },
            getAddress: function c(a) {
                var b = angular.extend({}, {
                    messageType: 'GetAddress',
                    addressN: [0],
                    coinName: 'Bitcoin',
                    showDisplay: !1
                }, a);
                return h(b)
            },
            getEntropy: function c(bytelength) {
                return h({
                    messageType: 'GetEntropy',
                    bytelength: bytelength
                })
            },
            getPublicKey: function c(walletId) {
                return h({
                    messageType: 'GetPublicKey',
                    walletId: walletId
                })
            },
            getWalletNodes: function a(walletId) {
                return h({
                    messageType: 'GetWalletNodes',
                    accountId: walletId
                })
            },
            getTransactionHistory: function d(a, b, page) {
                var c = {
                    messageType: 'GetTransactionHistory',
                    accountId: a,
                    page: page || 1
                };
                return b && (c.subAccount = b),
                h(c)
            },
            reloadBalances: function a(walletId) {
                return h({
                    messageType: 'ReloadBalances',
                    accountId: walletId
                })
            },
            isValidExchangeRegion: function a() {
                return h({
                    messageType: 'IsValidExchangeRegion'
                })
            },
            requestTransactionSignature: function c(a) {
                var b = angular.extend({}, {
                    messageType: 'RequestTransactionSignature'
                }, a);
                return h(b)
            },
            requestCurrencyExchange: function c(a) {
                var b = angular.extend({}, {
                    messageType: 'RequestCurrencyExchange'
                }, a);
                return h(b)
            },
            confirmCurrencyExchange: function b(a) {
                return h({
                    messageType: 'CurrencyExchangeConfirmation',
                    transactionId: a
                })
            },
            feeLevelsForAccount: function c(a, b) {
                return h({
                    messageType: 'FeeLevelsForAccount',
                    accountId: a,
                    subAccount: b
                })
            },
            estimateFeeForTransaction: function e(a, b, c) {
                var d = {
                    messageType: 'EstimateFeeForTransaction',
                    accountId: a,
                    transactionAmount: c
                };
                return b && (d.subAccount = b),
                h(d)
            },
            getMaximumTransactionAmount: function e(a, b, c) {
                var d = {
                    messageType: 'GetMaximumTransactionAmount',
                    accountId: a,
                    feeLevel: c
                };
                return b && (d.subAccount = b),
                h(d)
            },
            getExchangeMarketInfo: function b(a) {
                return h({
                    messageType: 'GetExchangeMarketInfo',
                    exchangePair: a
                })
            },
            addAccount: function d(a, b, c) {
                return h({
                    messageType: 'AddAccount',
                    nodeVector: a,
                    name: b,
                    coinType: c
                })
            },
            deleteAccount: function b(a) {
                return h({
                    messageType: 'DeleteAccount',
                    accountId: a
                })
            },
            updateWalletName: function c(a, b) {
                return h({
                    messageType: 'ChangeWalletName',
                    accountId: a,
                    accountName: b
                })
            },
            sendPassphrase: function b(a) {
                return h({
                    messageType: 'Passphrase',
                    passphrase: a
                })
            },
            getBlockcypherApiToken: function a() {
                return h({
                    messageType: 'GetBlockcypherApiToken'
                })
            },
            isFirstRun: function a() {
                return h({
                    messageType: 'IsFirstRun'
                })
            },
            resetFirstRun: function a() {
                return h({
                    messageType: 'ResetFirstRun'
                })
            },
            reinitialize: function a() {
                return h({
                    messageType: 'Reinitialize'
                })
            },
            verifyDevice: function a() {
                return h({
                    messageType: 'VerifyDevice'
                })
            },
            setShapeShiftAuthToken: function b(a) {
                return h({
                    messageType: 'SetShapeShiftAuthTokenRequest',
                    token: a
                })
            },
            getShapeShiftAuthToken: function a() {
                return h({
                    messageType: 'GetShapeShiftAuthTokenRequest'
                })
            },
            clearShapeShiftAuthToken: function a() {
                return h({
                    messageType: 'ClearShapeShiftAuthTokenRequest'
                })
            }
        }
    }
    ]
}).run(['DeviceBridgeService', function(a) {
    a.startListener()
}
]),
angular.module('kkCommon').factory('NavigationService', ['$location', '$rootScope', '$route', '$timeout', function(a, b, c, d) {
    function e(a) {
        var b = _.find(c.routes, function(b) {
            return b.regexp && a.match(b.regexp)
        });
        return !!b.goable
    }
    function f(c, f, k) {
        if (!j && (h && !c && (c = h,
        h = void 0),
        c.toLowerCase() !== a.path().toLowerCase())) {
            if (-1 !== _.indexOf(i, c))
                for (; i.length && i.pop() !== c; )
                    ;
            else
                e(a.path()) && !k && i.push(a.path());
            b.pageAnimationClass = 'undefined' == typeof f ? 'undefined' == typeof g ? 'cross-fade' : g : f,
            console.log('navigating from %s to %s with "%s" transition', i.join(' > '), c, b.pageAnimationClass),
            g = void 0,
            d(function() {
                b.$digest(),
                a.path(c)
            })
        }
    }
    var g, h, i = [], j = !1;
    return {
        go: f,
        goToPrevious: function c(a) {
            var b = _.last(i);
            b && f(b, a, !0)
        },
        setNextTransition: function b(a) {
            g = a
        },
        setNextDestination: function b(a) {
            h = a
        },
        getPreviousRoute: function a() {
            return _.last(i) || ''
        },
        getCurrentRoute: function b() {
            return a.path()
        },
        dumpHistory: function a() {
            i.length = 0
        },
        hasPreviousRoute: function a() {
            return !!_.last(i)
        },
        addHistory: function b(a) {
            i.push(a)
        },
        disableNavigation: function b(a) {
            j = a
        }
    }
}
]).run(['$rootScope', 'NavigationService', function(a, b) {
    a.go = b.go
}
]),
angular.module('kkCommon').factory('NotificationService', ['$http', 'notificationConfig', function() {
    return {
        notifications: {},
        initialize: function a() {}
    }
}
]).run(['NotificationService', 'environmentConfig', function(a, b) {
    a.initialize(),
    setInterval(function() {
        a.initialize()
    }, b.notificationInterval)
}
]),
angular.module('kkCommon').factory('WalletNodeService', ['$rootScope', '$timeout', 'DeviceBridgeService', 'environmentConfig', 'CurrencyLookupService', function(a, b, c, d, e) {
    function f(a, b) {
        a.accountNumber = _.trim(_.last(a.nodePath.split('/')), '\''),
        a.highConfidenceBalance = new BigNumber(a.highConfidenceBalance),
        a.lowConfidenceBalance = new BigNumber(a.lowConfidenceBalance),
        a.balance = a.lowConfidenceBalance.plus(a.highConfidenceBalance),
        a.subAccounts.forEach(function(b) {
            f(b, a.subAccounts)
        });
        var c = _.find(b, {
            id: a.id,
            coinType: a.coinType
        });
        c ? c !== a && _.merge(c, a) : i.push(a)
    }
    function g(a, b) {
        var c = _.find(i, {
            id: a
        });
        return c && b && (c = _.find(c.subAccounts, {
            coinType: b
        })),
        c
    }
    function h() {
        j.firstWalletId = !i.length ? void 0 : 0
    }
    var i = []
      , j = {}
      , k = {
        status: !1
    };
    return {
        wallets: i,
        walletStats: j,
        reload: function(b, walletId) {
            _.each(i, function(a) {
                delete a.chainCode,
                delete a.publicKey,
                delete a.xpub,
                b && a.addresses && a.addresses.length && (a.addresses.length = 0)
            }),
            c.getWalletNodes(walletId),
            setTimeout(function() {
                a.$digest()
            })
        },
        getWalletById: g,
        updateWalletNodes: function(b, d) {
            return k.status = d,
            0 === b.length ? void c.addAccount('m/44\'/0\'/0\'', 'Main Account', 'Bitcoin') : void (b.forEach(function(a) {
                f(a, i)
            }),
            h(),
            setTimeout(function() {
                a.$digest()
            }))
        },
        updateWalletHistory: function(b) {
            var c = g(b.id, b.subAccount);
            if (_.get(c, 'txHist'))
                angular.copy(b.txHist, c.txHist);
            else if (c)
                c.txHist = b.txHist;
            else if (b.subAccount) {
                var d = g(b.id);
                d || (d = {
                    id: b.id,
                    subAccounts: []
                },
                i.push(d)),
                d.subAccounts[e.getCoinType(b.subAccount)] = b
            } else
                i.push(b);
            a.$digest()
        },
        joinPaths: function() {
            return 'm/' + _.map(arguments, function(a) {
                return _.trim(a, 'm/')
            }).join('/')
        },
        pathToAddressN: function(a) {
            var b = a.split('/');
            return 'm' === b[0] && b.shift(),
            _.reduce(b, function(a, b) {
                var c = parseInt(b);
                return _.endsWith(b, '\'') && (c = (2147483648 | c) >>> 0),
                a.push(c),
                a
            }, [])
        },
        clear: function() {
            i.length = 0
        },
        getTransactionHistory: c.getTransactionHistory,
        loadAccounts: c.getWalletNodes,
        removeAccount: function(walletId) {
            _.remove(i, {
                id: walletId
            })
        },
        setUnfresh: function() {
            k.status = !1
        },
        getFreshStatus: function() {
            return k
        }
    }
}
]),
angular.module('kkCommon').factory('CurrencyLookupService', function() {
    var b;
    var formatSignedAmount = function(c, d)
    {
      if (_.isUndefined(c) || _.isUndefined(d))
          return 0;
      var e = d || 0
        , a = _.find(b, { name: c })
      return new a.displayAmountConstructor(e).shiftedBy(-a.decimals);
    }
    return {
        set: function c(a) {
            b = a,
            _.each(b, function(a) {
                a.addressRegExp = new RegExp(a.addressFormat),
                a.displayAmountConstructor = BigNumber.clone(a.amountParameters)
            })
        },
        getCurrencySymbol: function(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'currencySymbol')
        },
        getCurrencyCode: function(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'coinTypeCode')
        },
        getCurrencyAddressRegExp: function(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'addressRegExp')
        },
        getCoinType: function d(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'coinType')
        },
        getCurrencyTypes: function a() {
            return _.map(b, 'name')
        },
        getAccountCurrencyTypes: function a() {
            return _(b).filter({
                isToken: !1
            }).map('name').value()
        },
        isExchangeForbidden: function d(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'exchangeForbidden')
        },
        getDust: function(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'dust')
        },
        isToken: function(a) {
            var c = _.find(b, {
                name: a
            });
            return _.get(c, 'isToken')
        },
        formatAmount: function g(c, d) {
            var amount = formatSignedAmount(c, d)
            return amount && amount.gte(0) ? amount : 0
        },
        formatSignedAmount: formatSignedAmount,
        unformatAmount: function e(a, c) {
            ['', '.', void 0].includes(c) && (c = 0);
            var d = _.find(b, {
                name: a
            });
            return new BigNumber(c).shiftedBy(d.decimals).integerValue()
        }
    }
}),
angular.module('kkCommon').factory('SpotPriceService', function()
{
  const geckoAlias =
  {
    "BitcoinCash" : "bitcoin-cash",
    "BitcoinSV" : "bitcoin-cash-sv",
    "BitcoinGold" : "bitcoin-gold",
    "Firo" : "zcoin",
    "0xBitcoin" : "oxbitcoin",
    "BAT" : "basic-attention-token",
    "Crypto.com" : "monaco",
    "FOX" : "shapeshift-fox-token",
    "iExec" : "iexec-rlc",
    "RCN" : "ripio-credit-network",
    "SwarmCity" : "swarm-city",
    "TrueUSD" : "true-usd",
  }
  const fiatIds = ['usd', 'eur']
  var assetIds = []
  var spotPromise
  var adjustSym = n => geckoAlias[n] || n.toLowerCase()
  var spotService = {}

  spotService.setAssets = function(assets)
  {
    if (!_.isArray(assets)) return false
    if (assets.length < 1) return false

    assetIds = _.union(assetIds, assets.map(adjustSym))
    return true
  }
  spotService.get = function(fiat, crypto)
  {
    if (!assetIds) return Promise.reject('SpotPriceService assetIds not set!')
    if (!spotPromise)
    {
      let url = 'https://api.coingecko.com/api/v3/simple/price?'
              + 'ids=' + assetIds.join(',') + '&'
              + 'vs_currencies=' + fiatIds.join(',')
      spotPromise = fetch(url)
        .then(function(resp)
        {
          if (resp.ok) return resp.json()

          spotService.clearCache()
          return undefined
        })
        .catch(spotService.clearCache)
    }
    fiat = adjustSym(fiat)
    crypto = adjustSym(crypto)
    return spotPromise.then(resp => _.get(resp, [crypto, fiat], undefined))
      .then(function(resp)
      {
        console.debug(`CoinGecko Spot: ${crypto} - ${resp}`)
        return resp
      })
  }
  spotService.clearCache = function()
  {
    spotPromise = null
  }
  spotService.clearSession = function()
  {
    assetIds = []
    spotPromise = null
  }

  return spotService
}),
angular.module('kkCommon').run(['$templateCache', function(a) {
    a.put('app/common/common.tpl.html', ''),
    a.put('app/common/directives/exchangeFormattedAmount.tpl.html', '<span class=cryptocurrency-amount><span ng-hide="!hasExchangeRate || amount == 0"><span class=wallet-approx>&#8776; </span><span class=wallet-amount ng-bind=exchangeFormattedAmount></span> <span class=wallet-currency ng-bind=exchangeCurrencySymbol></span></span></span>'),
    a.put('app/common/directives/formattedAmount.tpl.html', '<span class=cryptocurrency-amount><span class=wallet-amount ng-bind=formattedAmount></span> <span ng-hide=suppressSymbol><span class=wallet-currency ng-bind=currencySymbol></span></span></span>')
}
]),
angular.module('kkCommon').constant('supportsEthereum', !0).constant('confidenceThreshholds', {
    highConfidence: .98,
    acceptableDelta: .001
}).constant('defaultAccounts', [{
    name: 'Main',
    hdNode: 'm/44\'/0\'/0\''
}]).constant('cliLogLevel', 'warn').constant('chromeLogLevel', 'info').constant('blockcypherMasterApiToken', 'd9a5e85023faa87914a191f6a741a2c4').constant('transactionReloadThrottle', 3e4).constant('feeReloadThrottle', 1e4).constant('ValueTransferGasLimit', 36e3).constant('TransactionTimeout', 6e5).constant('ShapeShiftApiPublicKey', '6ad5831b778484bb849da45180ac35047848e5cac0fa666454f4ff78b8c7399fea6a8ce2c7ee6287bcd78db6610ca3f538d6b3e90ca80c8e6368b6021445950b').constant('ShapeShiftSignatureKey', '1HxFWu1wM88q1aLkfUmpZBjhTWcdXGB6gT').constant('EtherscanApiToken', '8VMWZ17XJ3KQIGS4J2NFUS4YBHHZJSG65P').constant('firmware', {
    repository: 'keepkey-firmware',
    tag: 'v4.0.0'
}).constant('environment', 'prod').constant('jsonIndent', 0).constant('keepkeyProxy', {
    applicationId: 'idgiipeogajjpkgheijapngmlbohdhjg'
}).constant('keepkeyWallet', {
    applicationId: 'hmldnhmidmcofnbojkgfnibmhmjopbpc'
}).constant('selectedFeeService', 'earn').constant('feeServices', {
    earn: {
        url: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
        bytesPerFee: 1,
        feePaths: {
            fast: 'fastestFee',
            medium: 'halfHourFee',
            slow: 'hourFee'
        }
    },
    coinquery: {
        url: 'https://coinquery.com/fees.json',
        bytesPerFee: 1,
        feePaths: {
            fast: 'fastestFee',
            medium: 'halfHourFee',
            slow: 'hourFee'
        }
    },
    blockcypher: {
        url: 'http://api.blockcypher.com/v1/btc/main',
        bytesPerFee: 1e3,
        feePaths: {
            fast: 'high_fee_per_kb',
            medium: 'medium_fee_per_kb',
            slow: 'low_fee_per_kb'
        }
    }
}).constant('environmentConfig', {
    showFeeSelector: !0,
    regularFeeLevel: 'medium',
    maxReceiveAddresses: 10,
    notificationInterval: 12e4,
    showFiatBalance: !0
}).constant('membershipPlatform', {
    url: 'https://auth.shapeshift.io',
    clientId: 'd55063d8-7e56-4e46-bdd0-1163462e1972'
}).constant('notificationConfig', {
    notificationUrl: 'https://notifications.keepkey.com/notifications.prod.json.asc',
    publicKey: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v1\n\n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\nzB7/4+PfYlDvDLA+\n=qeAm\n-----END PGP PUBLIC KEY BLOCK-----'
}).constant('VERSION', '6.7.5');
