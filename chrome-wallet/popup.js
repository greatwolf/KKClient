'use strict';
angular.module('kkWallet', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'monospaced.qrcode', 'kkCommon', 'ngMessages', 'ngSanitize']).config(['$compileProvider', function(e)
  {
    e.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/),
      e.imgSrcSanitizationWhitelist(/^\s*(https?|chrome-extension)|data:image\/|\/?img\//)
  }]).run([function()
  {
    chrome.runtime.connect()
  }]),
  angular.module('kkWallet').run(['$rootScope', 'DeviceBridgeService', 'NavigationService', 'PinLockService', function(e, t, n, pinLock)
  {
    e.goBack = function()
      {
        n.goToPrevious('slideRight')
      },
      e.setNextTransition = n.setNextTransition,
      e.cancelDeviceOperation = function()
      {
        if (pinLock.state === pinLock.verifying)
          pinLock.state = pinLock.cancelling
        t.cancel()
      },
      e.cancelPinRequest = function()
      {
        e.cancelDeviceOperation()
        e.goBack()
      },
      e.openBuyKeepkeyWindow = function()
      {
        chrome.tabs.create(
        {
          url: 'https://httpslink.com/oz52'
        })
      }
  }]),
  angular.module('kkWallet').controller('AboutController', ['$scope', 'DeviceFeatureService', function(e, t)
  {
    e.device = t.features;
    e.launchWebsite = function()
      {
        window.open('https://www.keepkey.com/', '_blank')
      },
      e.launchBlog = function()
      {
        window.open('https://www.keepkey.com/blog/', '_blank')
      },
      e.launchEmailListSignup = function(e)
      {
        e.stopImmediatePropagation(),
          window.open('http://eepurl.com/cVS53b', '_blank')
      },
      e.launchTwitter = function()
      {
        window.open('https://twitter.com/bitcoinkeepkey', '_blank')
      },
      e.launchFacebook = function()
      {
        window.open('https://www.facebook.com/KeepKeyCo/', '_blank')
      },
      e.launchReddit = function()
      {
        window.open('https://www.reddit.com/r/keepkey/', '_blank')
      },
      e.launchYoutube = function()
      {
        window.open('https://www.youtube.com/channel/UCKYhndMvTYR9ka_lT4HZaqg', '_blank')
      },
      e.launchGithub = function()
      {
        window.open('https://github.com/keepkey', '_blank')
      }
  }]),
  angular.module('kkWallet').controller('BootloaderController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'DeviceFeatureService', 'DynamicConfigurationService', function(e, t, n, a, o)
  {
    e.dynamicConfiguration = {},
      o.get().then(function(t)
      {
        e.dynamicConfiguration = t
      }),
      e.enableButton = !a.initializedDeviceHasBeenConnected(),
      n.setNextTransition('slideLeft'),
      e.firmwareAvailable = _.get(a.features, 'deviceCapabilities.firmwareImageAvailable');
    var i = !a.features || a.features.available_firmware_versions || [];
    e.versionsAvailable = i.sort(function(e, t)
      {
        return semver.lt(e, t) ? 1 : semver.gt(e, t) ? -1 : 0
      }),
      e.isUpgrade = function(e)
      {
        return semver.gt(e, '6.0.0')
      },
      e.updateDevice = function(e)
      {
        t.updateDevice(e)
      };
    var c = a.get('deviceCapabilities.bootloaderUpgradeSkipable'),
      s = a.get('deviceCapabilities.bootloaderUpgradable');
    e.assumingDeviceIsInitialized = a.initializedDeviceHasBeenConnected(),
      e.$watch('dynamicConfiguration', function()
      {
        var t = !e.dynamicConfiguration.disableBootloaderUpdate && s;
        e.showOnly = t,
          e.showBootloaderButton = t,
          e.showFirmwareButton = !t || c
      }, !0)
  }]),
  angular.module('kkWallet').controller('AccountConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'DeviceBridgeService', 'NotificationMessageService', 'CurrencyLookupService', function(e, t, n, a, o, i, c)
  {
    function s()
    {
      var t = _.filter(e.walletList,
      {
        coinType: e.selectedAsset
      });
      return _.last(_.sortBy(t, function(e)
      {
        return parseInt(e.accountNumber)
      }))
    }

    function r(t)
    {
      var n = 0;
      return _.isUndefined(t) || (n = parseInt(t.accountNumber) + 1),
        ['m', '44\'', c.getCurrencyCode(e.selectedAsset), n + '\''].join('/')
    }
    e.walletList = n.wallets,
      e.walletName = '',
      e.assetTypes = angular.copy(c.getAccountCurrencyTypes()).sort(),
      e.selectedAsset = 'Bitcoin',
      e.setAssetType = function(t)
      {
        return e.selectedAsset = t,
          !1
      };
    var l = _.find(e.walletList,
    {
      id: t.accountId
    });
    l && (e.walletName = l.name),
      e.device = a.features,
      e.creating = !1;
    var d = e.walletList.length;
    e.addAccount = function()
      {
        if (e.form.$valid)
        {
          e.creating = !0;
          var t = s();
          if (t && !t.hasTransactionHistory)
            e.go('/failure/bip44_account_gap_violation/' + t.name, 'slideLeft');
          else
          {
            var n = r(t);
            console.log('new account node path:', n),
              i.set('Your new account was successfully created!'),
              o.addAccount(n, e.walletName, e.selectedAsset)
          }
        }
      },
      e.updateAccountName = function()
      {
        e.form.$valid && (e.creating = !0,
          i.set('Your account name was successfully updated!'),
          o.updateWalletName(t.accountId, e.walletName))
      },
      e.$watch('walletList.length', function()
      {
        e.walletList.length !== d && e.go('/walletlist', 'slideRight')
      })
  }]),
  angular.module('kkWallet').controller('ButtonRequestController', ['$scope', '$routeParams', 'DeviceBridgeService', 'ProxyInfoService', 'NavigationService', 'DeviceFeatureService', function(e, t, n, a, o, i)
  {
    o.setNextTransition('slideLeft'),
      e.buttonRequestType = t.code,
      e.proxyInfo = a.info,
      e.device = i.features,
      e.oldFirmwareVersion = i.features.firmwareUpdateAvailable,
      e.vendorName = i.get('deviceCapabilities.vendorName'),
      'shape_shift' === t.policy && (e.policyName = t.policy,
        e.policyDescription = 'ShapeShift Exchange',
        e.policyState = t.state,
        e.policyEnable = 'enable' === t.state);
    var c = o.getCurrentRoute();
    ('/buttonRequest/button_request_wipe_device' === c || '/buttonRequest/button_request_protect_call_change_label' === c || '/buttonRequest/button_request_change_pin_timeout' === c) && o.setNextTransition('slideRight'),
      e.$watch('proxyInfo.imageHashCodeTrezor', function(t)
      {
        e.firmwareFingerprint = t ? t.match(/.{1,40}/g) : []
      })
  }]),
  angular.module('kkWallet').controller('SignExchangeController', ['$scope', function(e)
  {
    e.cancelExchangeRequest = function()
    {
      e.cancelDeviceOperation()
    }
  }]),
  angular.module('kkWallet').controller('SignTxController', ['$scope', '$routeParams', 'TransactionService', 'NavigationService', function(e, t, n, a)
  {
    '/buttonRequest/button_request_sign_tx' === a.getCurrentRoute() ? a.setNextTransition('slideRight') : a.setNextTransition('slideLeft'),
      e.buttonRequestType = t.code,
      e.amount = n.transactionInProgress.amount,
      e.destination = n.transactionInProgress.address,
      e.fee = 'TBD'
  }]),
  angular.module('kkWallet').controller('CharacterRequestController', ['$scope', '$routeParams', '$timeout', 'RecoveryCipherModel', function(e, t, n, a)
  {
    function o(e, t)
    {
      e[t] = !0,
        n(function()
        {
          e[t] = !1
        }, 200)
    }

    function i(t, n)
    {
      t.disabled ? o(t, 'error') : (e.sendInProgress = !0,
        t.active = !0,
        o(t, 'active'),
        n())
    }
    for (e.getEmptyArray = function(e)
      {
        return Array(e)
      },
      e.getColumnArray = function(e, t)
      {
        for (var n = [], a = Math.ceil(e / 3), o = t * a, c = Math.min(e, o + a - 1), s = o; s <= c; s++)
          n.push(s);
        return n
      },
      e.model = a.getModel(),
      e.model.currentWord = parseInt(t.word_pos),
      e.model.currentCharacterPosition = parseInt(t.character_pos),
      e.wordCount = 12; e.model.currentWord >= e.wordCount;)
      e.wordCount += 6;
    e.wordLength = 4,
      e.sendInProgress = !1,
      e.getCharAtCurrentPosition = function(t, n)
      {
        return t < e.model.currentWord || t === e.model.currentWord && n < e.model.currentCharacterPosition ? '*' : t === e.model.currentWord && n === e.model.currentCharacterPosition ? '|' : '-'
      },
      e.isCursorPosition = function(t, n)
      {
        return t === e.model.currentWord && n === e.model.currentCharacterPosition
      },
      e.wordCompleted = function(t)
      {
        return t < e.model.currentWord
      },
      e.wordPatterns = [],
      e.$watch('$routeParams', function()
      {
        e.model.currentWord = parseInt(t.word_pos),
          e.model.currentCharacterPosition = parseInt(t.character_pos)
      }),
      e.spaceBarClasses = {
        error: !1,
        disabled: 3 > e.model.currentCharacterPosition || 23 === e.model.currentWord,
        active: !1
      },
      e.spaceBarIcon = e.spaceBarClasses.disabled ? 'fa-times' : 'fa-check',
      e.letterClasses = {
        error: !1,
        disabled: e.model.currentCharacterPosition >= 4,
        active: !1
      },
      e.letterIcon = e.letterClasses.disabled ? 'fa-times' : 'fa-check',
      e.backspaceClasses = {
        active: !1,
        error: !1,
        disabled: 0 === e.model.currentWord && 0 === e.model.currentCharacterPosition
      },
      e.backspaceIcon = e.backspaceClasses.disabled ? 'fa-times' : 'fa-check',
      e.enterClasses = {
        active: !1,
        error: !1,
        disabled: -1 === [11, 17, 23].indexOf(e.model.currentWord) || 3 > e.model.currentCharacterPosition
      },
      e.enterIcon = e.enterClasses.disabled ? 'fa-times' : 'fa-check',
      e.moreWordsAvailable = -1 !== [11, 17].indexOf(e.model.currentWord) && 3 <= e.model.currentCharacterPosition,
      e.onKeyPress = function(t)
      {
        if (t.preventDefault(),
          !e.sendInProgress)
        {
          var n = t.keyCode;
          13 === n ? i(e.enterClasses, function()
          {
            a.sendEnter()
          }) : 8 === n ? i(e.backspaceClasses, function()
          {
            a.sendBackspace()
          }) : 32 === n ? i(e.spaceBarClasses, function()
          {
            a.sendCharacter(' ')
          }) : 65 <= n && 90 >= n && i(e.letterClasses, function()
          {
            a.sendCharacter(String.fromCharCode(n).toLowerCase())
          })
        }
      },
      e.send = a.sendEnter
  }]).factory('RecoveryCipherModel', ['DeviceBridgeService', 'NavigationService', function(e, t)
  {
    var n = {
      currentCharacterPosition: 0,
      currentWord: 0
    };
    return {
      getModel: function e()
      {
        return n
      },
      sendCharacter: function a(n)
      {
        t.setNextTransition('noAnimation'),
          e.characterAck(n)
      },
      sendEnter: function n()
      {
        t.setNextTransition('slideLeft'),
          e.characterAck('', !1, !0)
      },
      sendBackspace: function n()
      {
        t.setNextTransition('noAnimation'),
          e.characterAck('', !0, !1)
      }
    }
  }]),
  angular.module('kkWallet').controller('ConfirmExchangeController', ['$scope', 'DeviceBridgeService', 'ExchangeService', 'WalletNodeService', function(e, t, n, a)
  {
    e.depositAmount = n.get('deposit.amount'),
      e.depositCurrency = n.get('deposit.coinType'),
      e.depositAccount = n.get('deposit.accountId'),
      e.withdrawalAmount = n.get('withdrawal.amount'),
      e.withdrawalCurrency = n.get('withdrawal.coinType'),
      e.withdrawalAccount = n.get('withdrawal.accountId'),
      e.withdrawalAccountName = a.getWalletById(e.withdrawalAccount).name,
      e.withdrawalCurrencyName = a.getWalletById(e.withdrawalAccount).coinType,
      e.exchangeRate = n.get('rate'),
      e.minerFee = n.get('minerFee'),
      e.transactionId = n.get('transactionId'),
      e.nextAction = function()
      {
        t.confirmCurrencyExchange(e.transactionId)
      },
      e.cancelExchangeRequest = function()
      {
        e.goBack()
      }
  }]),
  angular.module('kkWallet').controller('ConnectController', ['$scope', '$timeout', 'SupportService', function(e, t, n)
  {
    e.showMessage = !1,
      e.launchSupportTab = n.launchSupportTab,
      t(function()
      {
        e.showMessage = !0
      }, 3e4)
  }]),
  angular.module('kkWallet').controller('DeviceController', ['$scope', '$routeParams', 'NavigationService', 'EntryPointNavigationService', 'DeviceBridgeService', 'DeviceFeatureService', 'ShapeShiftAuthTokenService', 'PinLockService', function(e, t, n, a, o, i, c, pinLock)
  {
    pinLock.reset();
    e.wipeDevice = function()
      {
        n.setNextTransition('slideLeft'),
          o.wipeDevice()
      },
      e.changePin = function()
      {
        n.setNextTransition('slideLeft'),
          o.changePin()
      },
      e.togglePassphrase = function(e)
      {
        o.enablePassphrase(
          {
            enabled: !e.passphrase_protection
          }),
          o.initialize()
      },
      e.supportsRecoveryDryRun = i.get('deviceCapabilities.supportsRecoveryDryRun'),
      e.recoveryDryRun = function()
      {
        o.recoverDevice(
        {
          label: '',
          pin_protection: !0,
          passphrase_protection: !1,
          word_count: 12,
          language: 'english',
          enforce_wordlist: !0,
          use_character_cipher: !0,
          dry_run: !0
        })
      },
      e.loginToSS = c.login,
      e.logoutFromSS = c.clear,
      e.showLoginButton = !0,
      e.device = i.features,
      e.goToTop = a.goToTop,
      e.$watch(function()
      {
        return c.value()
      }, function()
      {
        e.showLoginButton = !c.value()
      }, !1)
  }]),
  angular.module('kkWallet').controller('LifeboatController', ['$scope', '$routeParams', 'NavigationService', 'EntryPointNavigationService', 'DeviceBridgeService', 'DeviceFeatureService', 'PinLockService', function(e, t, n, a, o, i, pinLock)
  {
    pinLock.reset();
    e.wipeDevice = function()
      {
        n.setNextTransition('slideLeft'),
          o.wipeDevice()
      },
      e.device = i.features,
      e.goToTop = a.goToTop
  }]),
  angular.module('kkWallet').controller('ExchangeController', ['$scope', '$http', '$routeParams', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService', 'environmentConfig', 'DeviceFeatureService', 'CurrencyLookupService', 'ExchangeMarketInfoService', 'ShapeShiftAuthTokenService', 'ExchangeValidityService', function(e, t, n, a, o, i, c, s, r, l, d, u, p, v)
  {
    function m()
    {
      if (e.sourceAccount)
      {
        var t = '';
        if (e.sourceAccount.isToken && (t = e.sourceAccount.coinType),
          s.getMaximumTransactionAmount(e.sourceAccount.id, t, e.userInput.feeLevel),
          !_.get(s, 'maxTransactionAmount.max'))
          e.maxSendAmount = 0;
        else if (e.maxSendAmount = s.maxTransactionAmount.max,
          e.maxReason = 'Exceeds wallet balance',
          _.get(e.exchangeMarketInfo, 'max'))
        {
          var n = new BigNumber(_.get(e.exchangeMarketInfo, 'max'));
          n.lt(e.maxSendAmount) && (e.maxSendAmount = n,
              e.maxReason = 'Exceeds ShapeShift maximum'),
            e.maxSendAmount = BigNumber.min(e.maxSendAmount, n)
        }
      }
    }

    function g()
    {
      e.sourceAccount && (_.get(e.exchangeMarketInfo, 'min') ? (e.minSendAmount = new BigNumber(_.get(e.exchangeMarketInfo, 'min')),
        e.minReason = 'Below ShapeShift minimum') : (e.minSendAmount = d.getDust(e.currency),
        e.minReason = 'Below dust limit'))
    }

    function h()
    {
      if (e.sourceAccount && e.currency)
      {
        var t = d.unformatAmount(e.currency, e.userInput.amount);
        s.compute(e.sourceAccount.id, n.subaccount, t)
      }
    }

    function b()
    {
      var t = e.userInput.amount ? e.userInput.amount : 0,
        n = e.estimatedReceiveAmount ? e.estimatedReceiveAmount : 0,
        a = new BigNumber(t).isLessThanOrEqualTo(new BigNumber(0)),
        o = new BigNumber(n).isLessThanOrEqualTo(new BigNumber(0));
      e.disableTradeButton = a || o || e.preparingTransaction || e.isExchangeError()
    }

    function f()
    {
      e.destinationAccount && (e.estimatedReceiveAmount = u.estimateReceiveAmount(e.userInput.amount, e.currency, e.destinationAccount.coinType),
        new BigNumber(e.userInput.amount).isLessThanOrEqualTo(new BigNumber(0)) && (e.minReason = 'Send amount too low'))
    }
    e.preparingTransaction = !1,
      e.conversionError = '',
      e.config = r;
    var y = _(i.wallets).sortBy('name').value();
    e.accounts = _(y).sortBy('name').value(),
      e.buttonText = 'Trade',
      e.currentRecipient = '',
      e.focusedElement = 'foo',
      e.feeLevels = [],
      e.sourceCurrency = {},
      e.destinationCurrency = {},
      e.showLogin = !1,
      e.disableTradeButton = !0,
      v.reset(),
      e.userInput = {
        address: '',
        amount: '',
        feeLevel: e.config.regularFeeLevel
      },
      e.$watch(function()
      {
        return _.get(s, 'maxTransactionAmount.max')
      }, m, !0),
      e.$watch('userInput.amount', h),
      e.$watch('userInput.amount', f),
      e.$watch('userInput.amount', b, !0),
      e.$watch('exchangeMarketInfo', f, !0),
      e.$watch('exchangeMarketInfo', g, !0),
      e.$watch('exchangeMarketInfo', m, !0),
      e.$watch('exchangeMarketInfo', b, !0),
      e.$watch('sourceAccount', function()
      {
        e.sourceAccount && e.currency && (s.getMaximumTransactionAmount(e.sourceAccount.id, n.subaccount, e.userInput.feeLevel),
          s.compute(e.sourceAccount.id, n.subaccount, d.unformatAmount(e.currency, e.userInput.amount)))
      }, !0),
      e.$watch('sourceAccount', h, !0),
      e.$watch('sourceAccount', g, !0),
      e.$watch('sourceAccount', m, !0),
      e.$watch('destinationAccount', g, !0),
      e.$watch('destinationAccount', m, !0),
      e.$watch('sourceAccount', function()
      {
        var t = e.sourceAccount;
        t && t.id && (e.currency = t.coinType,
          e.sourceCurrency = t.coinType,
          e.symbol = d.getCurrencySymbol(e.currency),
          e.withdrawalAmount = '',
          e.userInput.amount = '',
          e.conversionError = '',
          e.fresh = i.getFreshStatus(),
          e.bchOnly = 'BitcoinCash' === e.sourceCurrency,
          e.enableBchButton = !e.bchOnly)
      }),
      e.$watch(function()
      {
        return p.value()
      }, function()
      {
        e.showLogin = !p.value()
      }, !1),
      e.$watch('destinationAccount', function()
      {
        e.destinationAccount && (e.destinationCurrency = e.destinationAccount.coinType,
          e.exchangeMarketInfo = u.getExchangeMarketInfo(e.currency, e.destinationCurrency),
          e.estimatedFee = s.estimatedFee)
      }),
      e.buildTransaction = function()
      {
        e.form.$valid && (e.preparingTransaction = !0,
          c.transactionInProgress = {
            accountId: e.sourceAccount.id,
            amount: d.unformatAmount(e.currency, e.userInput.amount),
            feeLevel: e.userInput.feeLevel
          },
          e.sourceAccount.isToken && (c.transactionInProgress.subAccount = e.currency),
          e.destinationAccount && (c.transactionInProgress.sendToAccount = e.destinationAccount.id,
            c.transactionInProgress.sendToCurrency = e.destinationCurrency),
          a.requestCurrencyExchange(c.transactionInProgress),
          o.setNextTransition('slideLeft'))
      },
      e.setFeeLevel = function(t)
      {
        e.userInput.feeLevel = t
      },
      e.getFee = function(t)
      {
        return _.get(e, 'estimatedFee.fee.' + t) || 0
      },
      e.showFee = function()
      {
        if (e.userInput && e.userInput.amount)
          try
          {
            var t = d.unformatAmount(e.currency, e.userInput.amount);
            return 0 < e.getFee(e.userInput.feeLevel) && t.lte(e.maxSendAmount) && t.gte(e.minSendAmount)
          }
        catch (t)
        {
          return console.log(t),
            !1
        }
      },
      e.getFeeCurrency = function()
      {
        return _.get(e, 'estimatedFee.fee.currency')
      },
      e.isExchangeError = function()
      {
        return v.status.errorCode !== v.NO_VALIDITY_ERROR
      }
  }]),
  angular.module('kkWallet').directive('accountBalance', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        account: '=',
        loading: '=',
        accountSettings: '=',
        nameDisplay: '@',
        singleAccount: '=',
        currency: '=',
        fresh: '='
      },
      controller: ['$scope', function(e)
      {
        'number' === e.nameDisplay ? e.name = 'Account #' + e.account.accountNumber : 'name' === e.nameDisplay && e.account && (e.name = e.account.name),
          e.$watch('account', function()
          {
            e.account && (e.accountImageUrl = 'assets/currency-logos/' + e.account.coinType.toLowerCase() + '.png')
          }),
          e.canEdit = function()
          {
            return 'function' == typeof e.accountSettings
          }
      }],
      templateUrl: 'app/popup/directives/AccountBalanceComponent.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('amountEntry', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        amount: '=',
        maxAmount: '=',
        minAmount: '=',
        minReason: '=',
        maxReason: '=',
        fieldName: '@',
        form: '=',
        disabled: '=',
        currency: '=',
        isExchangeAmountLabel: '=',
        focusedElement: '=',
        loading: '='
      },
      controller: ['$scope', 'CurrencyLookupService', function(e, t)
      {
        function n()
        {
          e.bigMaxAmount = e.maxAmount ? new BigNumber(e.maxAmount) : new BigNumber(0),
            e.formattedMax = t.formatAmount(e.currency, e.bigMaxAmount)
        }

        function a()
        {
          var n = new BigNumber(t.getDust(e.currency)),
            a = e.minAmount ? new BigNumber(e.minAmount) : new BigNumber(0);
          e.bigMinAmount = a.isGreaterThan(n) ? a : n,
            e.formattedMin = t.formatAmount(e.currency, e.bigMinAmount)
        }
        e.currency && (e.previousValue = '',
          e.amountLabel = 'Amount:',
          a(),
          n(),
          e.symbol = t.getCurrencySymbol(e.currency),
          e.fillMax = function(t)
          {
            return e.amount = e.getMaxAmount().toString(),
              t && t.preventDefault(),
              !1
          },
          e.fillMaxDetector = function(t)
          {
            return '!' !== t.key || e.fillMax(t)
          },
          e.getMaxAmount = function()
          {
            return e.bigMaxAmount.isEqualTo(0) ? (e.maxLessThanMin = !0,
              e.bigMaxAmount) : (e.maxLessThanMin = e.bigMaxAmount.isLessThan(e.bigMinAmount),
              t.formatAmount(e.currency, e.bigMaxAmount))
          },
          e.$watch('maxAmount', n),
          e.$watch('minAmount', a),
          e.$watch('currency', function()
          {
            e.symbol = t.getCurrencySymbol(e.currency)
          }))
      }],
      link: function t(e)
      {
        e.field = _.get(e.form, e.fieldName)
      },
      templateUrl: 'app/popup/directives/AmountEntry.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('compareTo', function()
  {
    return {
      require: 'ngModel',
      scope:
      {
        otherModelValue: '=compareTo'
      },
      link: function o(e, t, n, a)
      {
        a.$validators.compareTo = function(t)
          {
            return t === e.otherModelValue
          },
          e.$watch('otherModelValue', function()
          {
            a.$validate()
          })
      }
    }
  }),
  angular.module('kkWallet').directive('deviceLabel', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      controller: ['$scope', 'DeviceFeatureService', function(e, t)
      {
        e.deviceLabel = t.get('label') || t.get('deviceCapabilities.vendorName') || 'KeepKey'
      }],
      template: '<span class="device-label"> {{deviceLabel}} </span>'
    }
  }),
  angular.module('kkWallet').directive('exchangeSetupRecipientEntry', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        sourceAccount: '=',
        destinationAccount: '=',
        destinationAccountImageUrl: '=',
        selected: '=recipient',
        fieldName: '@',
        form: '=',
        disabled: '=',
        currentAccountNumber: '=currentAccount',
        currencyName: '@',
        filterRecipientForExchange: '='
      },
      link: function t(e)
      {
        e.field = _.get(e.form, e.fieldName)
      },
      controller: ['$scope', 'WalletNodeService', 'DeviceFeatureService', 'CurrencyLookupService', 'ExchangeMarketInfoService', 'ShapeshiftAvailabilityService', function(e, t, n, a, o, i)
      {
        function c(e)
        {
          return e && 'available' === e.status && 'available' === h.status
        }

        function s()
        {
          var n = t.getWalletById(e.currentAccountNumber, e.currencyName),
            a = t.getWalletById(e.currentAccountNumber);
          if (h = i.get(a.coinType),
            n ? (e.currentAccount = n,
              e.parentAccount = a) : (e.currentAccount = a,
              e.parentAccount = void 0),
            1 < t.wallets.length)
          {
            var o = u(t.wallets);
            o = _.reject(o,
              {
                coinType: e.currencyName
              }),
              e.parentAccount ? (o = _.concat(o, d(o)),
                o = _.reject(o, l),
                o = _.concat(o, r())) : 'Ethereum' === e.currentAccount.coinType ? o = _.concat(o, p()) : o = _.concat(o, v(o)),
              e.accounts = o.map(g).sort(m)
          }
          else
            e.placeholder = 'Enter an address...',
            e.accounts = []
        }

        function r()
        {
          return _.reject(e.parentAccount.subAccounts,
          {
            coinType: e.currencyName
          })
        }

        function l(t)
        {
          return t.coinType === e.parentAccount.coinType && t !== e.parentAccount
        }

        function d(t)
        {
          return _(t).flatMap(function(e)
          {
            return e.subAccounts
          }).reject(function(t)
          {
            return t.coinType !== e.currentAccount.coinType
          }).reject(function(t)
          {
            return t === e.currentAccount
          }).value()
        }

        function u(t)
        {
          return _.reject(t, function(t)
          {
            return !(t.id !== e.currentAccountNumber) && !(t.coinType !== e.currencyName)
          })
        }

        function p()
        {
          return _.reject(e.currentAccount.subAccounts, function(e)
          {
            return !e.isToken
          })
        }

        function v(e)
        {
          return _(e).map('subAccounts').flatten().reject(function(e)
          {
            return !e.isToken
          }).value()
        }

        function m(e, t)
        {
          var n = e.isAvailable,
            a = t.isAvailable;
          if (n === a)
            return e.name.toUpperCase() === t.name.toUpperCase() ? e.coinType.toUpperCase() === t.coinType.toUpperCase() ? 0 : e.coinType.toUpperCase() < t.coinType.toUpperCase() ? -1 : 1 : e.name.toUpperCase() < t.name.toUpperCase() ? -1 : 1;
          return n ? -1 : a ? 1 : void 0
        }

        function g(e)
        {
          var t = i.get(e.coinType);
          return {
            isTransfer: !1,
            marketInfo: t,
            isAvailable: c(t),
            isExchange: !0,
            name: e.name,
            isToken: e.isToken,
            coinType: e.coinType,
            accountNumber: e.accountNumber,
            id: e.id
          }
        }
        var h;
        e.currentAccountNumber && s(),
          e.placeholder = 'Select one of your accounts...',
          e.labelVariation = 'Select an asset to trade for:',
          e.$watch('selected', function()
          {
            e.destinationAccount = e.selected,
              e.destinationAccount && e.destinationAccount.coinType && (e.destinationAccountImageUrl = 'assets/currency-logos/' + e.destinationAccount.coinType.toLowerCase() + '.png')
          }),
          e.$watch('currentAccountNumber', function()
          {
            e.currentAccountNumber && s()
          }),
          e.$watch(function()
          {
            return i.data
          }, function()
          {
            e.accounts && (e.accounts.forEach(function(t)
              {
                t.isAvailable = c(t.marketInfo) && !a.isExchangeForbidden(e.currentAccount.coinType) && !a.isExchangeForbidden(t.coinType)
              }),
              e.accounts = e.accounts.sort(m))
          }, !0),
          e.$watch('selected', function()
          {
            _.isString(e.selected) ? e.field.$setValidity('exchangeAvailability', !0) : _.isObject(e.selected) && e.field && e.field.$setValidity('exchangeAvailability', e.selected.isAvailable)
          })
      }],
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('feeSelector', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        feeLevels: '=',
        selected: '=',
        active: '='
      },
      controller: ['$scope', 'FeeService', 'environmentConfig', function(e, t, n)
      {
        e.selected = n.regularFeeLevel,
          e.select = function(t)
          {
            e.selected = t
          },
          e.formatName = function(e)
          {
            return {
              frugal: 'Frugal',
              slow: 'Economy',
              medium: 'Normal',
              fast: 'Priority',
              dashInstantSend: 'InstantSend'
            } [e]
          }
      }],
      templateUrl: 'app/popup/directives/FeeSelector.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('notification', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope: !1,
      controller: ['$scope', 'NotificationService', 'NavigationService', function(e, t, n)
      {
        if (t.notifications.set)
        {
          var a = t.notifications.messages.notifications;
          e.messages = '';
          var o = {};
          for (var c in e)
            '$' !== c[0] && 'this' !== c && 'constructor' !== c && e.hasOwnProperty(c) && (o[c] = e[c]);
          e.entireScope = o,
            e.$watch('entireScope', function()
            {
              var t = [];
              _.each(a, function(a)
                {
                  n.getCurrentRoute().toString().match(a.route) && e.$eval(a.condition) && t.push(a.message)
                }),
                e.messages = _.join(t, ', ')
            }, !0)
        }
      }],
      templateUrl: 'app/popup/directives/Notification.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('notificationMessage', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        canNotify: '=?'
      },
      controller: ['$scope', '$timeout', 'NotificationMessageService', function(e, t, n)
      {
        function a(n)
        {
          e.message = n,
            e.showMessage = !0,
            t(function()
            {
              e.showMessage = !1
            }, 1500)
        }
        e.message = '',
          e.showMessage = !1,
          angular.isUndefined(e.canNotify) && (e.canNotify = !0),
          e.$watch('notificationMessageService.get()', function()
          {
            var t = n.get();
            '' !== t && e.canNotify && (a(n.get()),
              n.clear())
          })
      }],
      templateUrl: 'app/popup/directives/notificationMessage.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('recipientEntry', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        selected: '=recipient',
        fieldName: '@',
        form: '=',
        disabled: '=',
        currentAccountNumber: '=currentAccount',
        currencyName: '@',
        filterRecipientForExchange: '='
      },
      link: function t(e)
      {
        e.field = _.get(e.form, e.fieldName)
      },
      controller: ['$scope', 'WalletNodeService', 'DeviceFeatureService', 'CurrencyLookupService', 'ExchangeMarketInfoService', 'ShapeshiftAvailabilityService', function(e, t, n, a, o, i)
      {
        function c(e)
        {
          return 'available' === e.status && 'available' === b.status
        }

        function s()
        {
          e.labelVariation = 'Send ' + e.currencyName + ' to:';
          var a = t.getWalletById(e.currentAccountNumber, e.currencyName),
            o = t.getWalletById(e.currentAccountNumber);
          if (b = i.get(o.coinType),
            a ? (e.currentAccount = a,
              e.parentAccount = o) : (e.currentAccount = o,
              e.parentAccount = void 0),
            1 < t.wallets.length)
          {
            e.placeholder = 'Enter address or select one of your accounts...';
            var c = u(t.wallets);
            (!_.get(n.features, 'deviceCapabilities.supportsSecureAccountTransfer') || e.filterRecipientForExchange) && (c = _.reject(c,
            {
              coinType: e.currencyName
            })),
            e.parentAccount ? (c = _.concat(c, d(c)),
                c = _.reject(c, l),
                c = _.concat(c, r())) : 'Ethereum' === e.currentAccount.coinType ? c = _.concat(c, p()) : c = _.concat(c, v(c)),
              e.accounts = c.map(h).sort(g)
          }
          else
            e.placeholder = 'Enter an address...',
            e.accounts = [];
          e.pattern = m()
        }

        function r()
        {
          return _.reject(e.parentAccount.subAccounts,
          {
            coinType: e.currencyName
          })
        }

        function l(t)
        {
          return t.coinType === e.parentAccount.coinType && t !== e.parentAccount
        }

        function d(t)
        {
          return _(t).flatMap(function(e)
          {
            return e.subAccounts
          }).reject(function(t)
          {
            return t.coinType !== e.currentAccount.coinType
          }).reject(function(t)
          {
            return t === e.currentAccount
          }).value()
        }

        function u(t)
        {
          return _.reject(t, function(t)
          {
            return !(t.id !== e.currentAccountNumber) && !(t.coinType !== e.currencyName)
          })
        }

        function p()
        {
          return _.reject(e.currentAccount.subAccounts, function(e)
          {
            return !e.isToken
          })
        }

        function v(e)
        {
          return _(e).map('subAccounts').flatten().reject(function(e)
          {
            return !e.isToken
          }).value()
        }

        function m()
        {
          var t = [];
          return e.filterRecipientForExchange || (t = [a.getCurrencyAddressRegExp(e.currencyName).source]),
            Array.prototype.push.apply(t, _.map(e.accounts, function(e)
            {
              return '^' + _.escapeRegExp(e.name) + '$'
            })),
            t.join('|')
        }

        function g(e, t)
        {
          var n = e.isAvailable,
            a = t.isAvailable;
          if (n == a)
            return e.name.toUpperCase() === t.name.toUpperCase() ? e.coinType.toUpperCase() === t.coinType.toUpperCase() ? 0 : e.coinType.toUpperCase() < t.coinType.toUpperCase() ? -1 : 1 : e.name.toUpperCase() < t.name.toUpperCase() ? -1 : 1;
          return n ? -1 : a ? 1 : void 0
        }

        function h(t)
        {
          var n = void 0,
            a = t.coinType === e.currencyName || e.parentAccount && e.parentAccount.id !== t.id && e.parentAccount.coinType === t.coinType && e.currentAccount.isToken;
          return a || (n = i.get(t.coinType)),
          {
            isTransfer: a,
            marketInfo: n,
            isAvailable: a || c(n),
            isExchange: !a,
            name: t.name,
            isToken: t.isToken,
            coinType: t.coinType,
            accountNumber: t.accountNumber,
            id: t.id
          }
        }
        var b;
        e.currentAccountNumber && s(),
          e.$watch('selected', function()
          {
            var t = _.get(e.selected, 'accountNumber');
            e.labelVariation = t ? e.selected.isTransfer ? 'Transfer ' + e.currencyName + ' to account:' : 'Trade ' + e.currencyName + ' for ' + e.selected.coinType + ' and send to:' : _.isString(e.selected) && e.selected.match(a.getCurrencyAddressRegExp(e.currencyName)) ? 'Send ' + e.currencyName + ' to address:' : 'Send ' + e.currencyName + ' to:'
          }),
          e.$watch('currentAccountNumber', function()
          {
            e.currentAccountNumber && s()
          }),
          e.$watch(function()
          {
            return i.data
          }, function()
          {
            e.accounts.forEach(function(t)
              {
                t.isAvailable = t.isTransfer || c(t.marketInfo) && !a.isExchangeForbidden(e.currentAccount.coinType) && !a.isExchangeForbidden(t.coinType)
              }),
              e.accounts = e.accounts.sort(g)
          }, !0),
          e.$watch('selected', function()
          {
            _.isString(e.selected) ? e.field.$setValidity('exchangeAvailability', !0) : _.isObject(e.selected) && e.field.$setValidity('exchangeAvailability', e.selected.isAvailable)
          })
      }],
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('refreshButton', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      controller: ['$scope', 'DeviceBridgeService', 'WalletNodeService', function(e, t, n)
      {
        e.refresh = function()
        {
          n.setUnfresh(),
            t.reloadBalances(e.walletId)
        }
      }],
      template: '<a class="refresh-button" uib-tooltip="Refresh" tooltip-popup-delay="500" tooltip-placement="auto bottom" tooltip-append-to-body="true"><div class="icon icon-refresh" ng-click="refresh()" ></div></a>'
    }
  }),
  angular.module('kkWallet').directive('sourceEntry', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        currency: '=',
        sourceAccount: '=',
        sourceAccountImageUrl: '='
      },
      link: function t(e)
      {
        e.field = _.get(e.form, e.fieldName)
      },
      controller: ['$scope', 'WalletNodeService', 'CurrencyLookupService', 'ShapeshiftAvailabilityService', function(e, t, n, a)
      {
        e.label = 'Select Account to trade from:';
        var o = _(t.wallets).sortBy('name').value(),
          i = [];
        o.forEach(function(t)
          {
            'Ethereum' === t.coinType && (i = _.concat(i, _.filter(t.subAccounts, function(e)
            {
              return e.isToken
            })))
          }),
          o = _.concat(o, i),
          o = _.filter(o, function(e)
          {
            return !e.highConfidenceBalance.isEqualTo(0)
          }),
          e.availableAccounts = o,
          e.$watch(function()
          {
            return a.data
          }, function()
          {
            e.accounts = _.filter(e.availableAccounts, function(e)
            {
              return 'available' == a.get(e.coinType).status
            })
          }, !0),
          e.$watch('selectedSourceAccount', function()
          {
            e.sourceAccount = e.selectedSourceAccount,
              e.sourceAccount && e.sourceAccount.coinType && (e.currency = e.sourceAccount.coinType,
                e.sourceAccountImageUrl = 'assets/currency-logos/' + e.sourceAccount.coinType.toLowerCase() + '.png')
          })
      }],
      templateUrl: 'app/popup/directives/SourceEntry.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('vendorName', function()
  {
    return {
      scope:
      {
        before: '@',
        after: '@'
      },
      restrict: 'E',
      replace: !0,
      controller: ['$scope', 'DeviceFeatureService', function(e, t)
      {
        e.vendorName = t.get('deviceCapabilities.vendorName'),
          e.vendorName || (e.vendorName = 'device')
      }],
      template: '<span class="vendor-name"> {{before}}{{vendorName}}{{after}} </span>'
    }
  }),
  angular.module('kkWallet').directive('walletSelectorDropdown', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        label: '@',
        buttonId: '@',
        accountList: '=',
        selected: '=',
        disabled: '='
      },
      controller: ['$scope', function(e)
      {
        e.select = function(t)
        {
          e.selected = t
        }
      }],
      templateUrl: 'app/popup/directives/WalletSelectorDropdown.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('backButton', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        destination: '=?',
        animation: '=?',
        action: '&?'
      },
      controller: ['$scope', 'NavigationService', function(e, t)
      {
        e.hasPreviousRoute = t.hasPreviousRoute() || e.destination || e.action,
          e.animation || (e.animation = 'slideRight'),
          e.actionFunction = e.destination ? function()
          {
            t.go(e.destination, e.animation)
          } :
          e.action ? e.action : function()
          {
            t.goToPrevious(e.animation)
          }
      }],
      template: '<a class="back-button" ng-show="hasPreviousRoute" ng-click="actionFunction()"><div class="icon icon-back"></div></a>'
    }
  }),
  angular.module('kkWallet').directive('bignumberMin', ['CurrencyLookupService', function(e)
  {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function i(t, n, a, o)
      {
        o.$validators.min = function(t, n)
          {
            var o = new BigNumber(0);
            try
            {
              o = e.unformatAmount(a.currency, n)
            }
            finally
            {
              return !o.isLessThan(a.bignumberMin)
            }
          },
          t.$watch(function()
          {
            return a.bignumberMin
          }, function()
          {
            return o.$validate
          })
      }
    }
  }]).directive('bignumberMax', ['CurrencyLookupService', function(e)
  {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function i(t, n, a, o)
      {
        o.$validators.max = function(t, n)
          {
            var o = new BigNumber(0);
            try
            {
              o = e.unformatAmount(a.currency, n)
            }
            finally
            {
              return !o.isGreaterThan(a.bignumberMax)
            }
          },
          t.$watch(function()
          {
            return a.bignumberMax
          }, function()
          {
            return o.$validate
          })
      }
    }
  }]),
  angular.module('kkWallet').directive('contenteditable', ['$timeout', function(e)
  {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function s(t, n, a, o)
      {
        if (o)
        {
          var i = {};
          angular.forEach(['stripBr', 'noLineBreaks', 'selectNonEditable', 'moveCaretToEndOnChange'], function(e)
            {
              var t = a[e];
              i[e] = t && 'false' !== t
            }),
            n.bind('keydown', function()
            {
              27 == event.which ? (o.$rollbackViewValue(),
                n[0].blur(),
                event.preventDefault()) : 13 == event.which && (o.$setViewValue(n.html()),
                n[0].blur(),
                event.preventDefault())
            }),
            n.bind('input', function()
            {
              t.$apply(function()
              {
                var t, a, c;
                t = n.html(),
                  c = !1,
                  i.stripBr && (t = t.replace(/<br>$/, '')),
                  i.noLineBreaks && (a = t.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, ''),
                    a !== t && (c = !0,
                      t = a)),
                  c && o.$render(),
                  '' === t && e(function()
                  {
                    n[0].blur(),
                      n[0].focus()
                  })
              })
            });
          var c = o.$render;
          o.$render = function()
            {
              var e, t, a, s;
              !c || c(),
                n.html(o.$viewValue || ''),
                i.moveCaretToEndOnChange && (e = n[0],
                  a = document.createRange(),
                  s = window.getSelection(),
                  0 < e.childNodes.length ? (t = e.childNodes[e.childNodes.length - 1],
                    a.setStartAfter(t)) : a.setStartAfter(e),
                  a.collapse(!0),
                  s.removeAllRanges(),
                  s.addRange(a))
            },
            i.selectNonEditable && n.bind('click', function(t)
            {
              var e, n, a;
              a = t.toElement,
                a !== this && 'false' === angular.element(a).attr('contenteditable') && (e = document.createRange(),
                  n = window.getSelection(),
                  e.setStartBefore(a),
                  e.setEndAfter(a),
                  n.removeAllRanges(),
                  n.addRange(e))
            })
        }
      }
    }
  }]),
  angular.module('kkWallet').directive('focus', function()
  {
    return {
      link: function n(e, t)
      {
        t[0].focus()
      }
    }
  }),
  angular.module('kkWallet').directive('pinPad', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        buttonText: '@',
        successRoute: '@'
      },
      controller: ['$scope', 'DeviceBridgeService', 'NavigationService', function(e, t, n)
      {
        e.pin = '',
          e.displayPin = '',
          e.appendToPin = function(t)
          {
            9 > e.pin.length && (e.pin = '' + e.pin + t)
          },
          e.sendPin = function()
          {
            if (!e.pin.length) return

            t.sendPin(
              {
                pin: e.pin
              }),
              e.pin = '',
              e.successRoute && n.go(e.successRoute)
          },
          e.$watch('pin', function()
          {
            e.displayPin = Array(e.pin.length + 1).join('*')
          }),
          e.backspace = function()
          {
            0 < e.pin.length && (e.pin = e.pin.substr(0, e.pin.length - 1))
          }
      }],
      templateUrl: 'app/popup/directives/pinPad.tpl.html'
    }
  }),
  angular.module('kkWallet').directive('settingsButton', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        route: '=?'
      },
      controller: ['$scope', 'NavigationService', 'DeviceBridgeService', function(e, t, n)
      {
        e.route || (e.route = '/device'),
          e.onClick = function()
          {
            t.dumpHistory(),
              n.cancel(),
              t.go(e.route, 'slideLeft')
          }
      }],
      template: '<a class="settings-button" ng-click="onClick()" uib-tooltip="Settings" tooltip-popup-delay="500" tooltip-placement="auto bottom" tooltip-append-to-body="true"><div class="icon icon-settings"></div></a>'
    }
  }),
  angular.module('kkWallet').directive('walletBalance', function()
  {
    return {
      restrict: 'E',
      replace: !0,
      scope:
      {
        balance: '=',
        pending: '=',
        loading: '=',
        currency: '='
      },
      controller: ['$scope', function(e)
      {
        e.$watch('pending', function()
        {
          e.showPending = e.pending && !new BigNumber(e.pending).eq(new BigNumber(0))
        })
      }],
      templateUrl: 'app/popup/directives/walletBalance.tpl.html'
    }
  }),
  angular.module('kkWallet').controller('Bip44AccountGapViolationController', ['$scope', '$routeParams', function(e, t)
  {
    e.previousAccountName = t.previousAccountName
  }]),
  angular.module('kkWallet').controller('FailureController', ['$scope', '$timeout', 'FailureMessageService', 'DeviceBridgeService', 'NavigationService', function(e, t, n, a, o)
  {
    var prevRoute = o.getPreviousRoute();
    e.showDeviceConfigurationButton = '/walletlist' === prevRoute;
    e.failures = _.map(n.get(), function(e)
      {
        return _.isArray(e.message) ? e.message.pop() : e.message ? e.message : 'Unspecified error occured'
      }),
      '/walletlist' !== prevRoute && o.setNextTransition('slideRight'),
      e.$on('$destroy', function()
      {
        if (!o.getCurrentRoute().startsWith('/failure')) n.clear()
      }),
      e.ok = function()
      {
        o.goToPrevious();
        if (o.getCurrentRoute() === '/failure/invalid_pin')
          a.requestPinRetry();
      }
  }]),
  angular.module('kkWallet').controller('FooterController', ['$scope', 'VERSION', 'DeviceFeatureService', function(e, t, n)
  {
    e.version = t,
      e.device = n.features
  }]),
  angular.module('kkWallet').controller('InitializationController', ['$scope', 'InitializationDataService', 'WalletNodeService', 'DeviceFeatureService', function(e, t, n, a)
  {
    e.features = a.features,
      e.initializationData = t,
      e.displayPin = '',
      n.clear(),
      e.appendToPin = function(t)
      {
        e.initializationData.pin = '' + e.initializationData.pin + t
      },
      e.$watch('initializationData.pin', function()
      {
        e.displayPin = Array(e.initializationData.pin.length + 1).join('*')
      })
  }]).factory('InitializationDataService', function()
  {
    return {
      label: '',
      pin: ''
    }
  }),
  angular.module('kkWallet').controller('ResetController', ['$scope', '$routeParams', 'ResetRecoverRequestModel', 'DeviceBridgeService', 'NavigationService', 'DeviceFeatureService', function(e, t, n, a, o, i)
  {
    e.resetRecoverData = n,
      e.changeLabel = 'settings' === t.nextAction,
      e.label = '',
      e.resetRecoverData.label = i.features.label,
      e.validSeedLength = [12, 18, 24],
      e.setSeedLength = function(n)
      {
        e.resetRecoverData.word_count = n
      },
      e.makeSeedDescription = function(n)
      {
        return n + " WORDS (" + (n * 11 - n / 3) + "-bits)"
      }
      e.nextAction = function()
      {
        return !!e.form.$valid && void(o.setNextTransition('slideLeft'),
          'label' === t.nextAction ? o.go('/label/initialize', 'slideLeft') : 'initialize' === t.nextAction ? a.resetDevice(e.resetRecoverData) : 'recover' === t.nextAction ? a.recoverDevice(e.resetRecoverData) : 'settings' === t.nextAction ? a.applySettings(
          {
            label: e.resetRecoverData.label
          }) : console.error('unknown next action:', t.nextAction))
      }
  }]).factory('ResetRecoverRequestModel', function()
  {
    return {
      label: '',
      pin_protection: !0,
      passphrase_protection: !1,
      word_count: 12,
      language: 'english',
      enforce_wordlist: !0,
      use_character_cipher: !0
    }
  }),
  angular.module('kkWallet').controller('PassphraseController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'PinLockService', function(e, t, n, pinLock)
  {
    pinLock.state = pinLock.verifying;
    e.userInput = {
        passphrase: '',
        confirmPassphrase: ''
      },
      e.sendPassphrase = function()
      {
        var prevRoute = n.getPreviousRoute().toString()
        return !!e.form.$valid && void(t.sendPassphrase(e.userInput.passphrase),
          prevRoute === '' ? n.go('/walletlist') : n.goToPrevious('slideRight'),
          e.userInput.passphrase = '',
          e.userInput.confirmPassphrase = '')
      }
  }]),
  angular.module('kkWallet').controller('PinController', ['$scope', '$routeParams', 'NavigationService', 'DeviceFeatureService', 'PinLockService', function(e, t, n, a, pinLock)
  {
    var prevRoute = n.getPreviousRoute();
    var currRoute = n.getCurrentRoute();
    e.onKeyPress = function(k)
    {
      var pinPad = e.$$childTail
      switch (k.key)
      {
        case 'Backspace':
          pinPad.backspace()
          break;
        case  'Enter':
          pinPad.sendPin()
          break;
        default:
          var numkey = Number(k.key)
          if (0 < numkey && numkey < 10)
            pinPad.appendToPin(numkey)
      }
    }
    pinLock.state = currRoute === '/pin/pin_matrix_request_type_current'
                  ? pinLock.verifying
                  : pinLock.idling;
    e.showDeviceConfigurationButton = !1,
      '/walletlist' === prevRoute ? (e.successRoute = prevRoute,
        e.showDeviceConfigurationButton = !0) : !prevRoute.startsWith('/lifeboat') && !prevRoute.startsWith('/device') ? (e.successRoute = prevRoute, n.setNextTransition('slideRight')) : '/pin/pin_matrix_request_type_new_second' === n.getCurrentRoute() && a.features.initialized ? n.setNextTransition('slideRight') : n.setNextTransition('slideLeft')
  }]),
  angular.module('kkWallet').controller('PinTimeoutController', ['$scope', '$routeParams', 'DeviceBridgeService', 'NavigationService', function(e, t, n, a)
  {
    e.timeout = 10,
      e.nextAction = function()
      {
        return !!e.form.$valid && void(a.setNextTransition('slideLeft'),
          n.changePinTimeout(
          {
            pinTimeout: 1e3 * (60 * e.timeout)
          }))
      }
  }]),
  angular.module('kkWallet').controller('PreparingController', ['$scope', 'ProgressService', 'NavigationService', function(e, t, n)
  {
    t.clear(),
      e.progress = t,
      n.setNextTransition('slideLeft')
  }]),
  angular.module('kkWallet').controller('ReceiveController', ['$rootScope', '$scope', '$routeParams', '$location', 'DeviceBridgeService', 'WalletNodeService', 'NavigationService', '$timeout', 'environmentConfig', 'ReceiveAddressService', 'PinLockService', function(e, t, n, a, o, i, c, s, r, l, pinLock)
  {
    c.setNextTransition('slideLeft'),
      new ClipboardJS('.copy-to-clipboard-button');
    var d = new Promise(function(t)
      {
        e.$on('ButtonRequest', function(e, n)
        {
          'ButtonRequest_Address' === n.code && t(n.code)
        })
      }),
      u = !1;
    t.walletId = n.walletId,
      t.addressDepth = parseInt(n.addressDepth) || 0,
      t.wallet = i.getWalletById(t.walletId),
      t.currency = t.wallet.coinType,
      t.maxDepth = r.maxReceiveAddresses - 1,
      t.isSingleAddressAccount = 'single' === t.wallet.addressStrategy
      switch(pinLock.state)
      {
        case pinLock.idling:
          l.clear()
          o.getReceiveAddress(t.walletId, t.addressDepth)
          break;
        case pinLock.cancelling:
          c.goToPrevious('slideRight')
          return;
        case pinLock.verifying:
          break;
      }
      t.$on('$destroy', function()
      {
        var ignorable =
        [
          '/pin/pin_matrix_request_type_current',
          '/passphrase',
          '/failure/invalid_pin'
        ]
        !u && d &&
        _.indexOf(ignorable, a.path()) === -1 &&
        (l.clear(), d.then(o.cancel))
      }),
      t.showAnotherAddress = function(e)
      {
        return !(0 > e || e > t.maxDepth) && void d.then(function()
        {
          u = !0,
            o.cancel(),
            s(function()
            {
              var n = ['/receive', t.walletId, e].join('/'),
                a = e > t.addressDepth ? 'slideLeft' : 'slideRight';
              t.go(n, a, !0)
            }, 5)
        })
      },
      t.$watch(l.value, function()
      {
        t.unusedAddress = l.value
      }, !0)
  }]),
  angular.module('kkWallet').controller('SendController', ['$scope', '$routeParams', 'DeviceBridgeService', 'ProgressService', 'NavigationService', 'WalletNodeService', 'TransactionService', 'FeeService', 'environmentConfig', 'DeviceFeatureService', 'CurrencyLookupService', 'ExchangeValidityService', 'ExchangeMarketInfoService', 'ShapeShiftAuthTokenService', 'PinLockService', function(e, t, n, progress, a, o, i, c, s, r, l, d, u, p, pinLock)
  {
    function v()
    {
      if (c.getMaximumTransactionAmount(e.wallet.id, t.subaccount, e.userInput.feeLevel),
        !_.get(c, 'maxTransactionAmount.max'))
        e.maxSendAmount = 0;
      else if (e.maxSendAmount = c.maxTransactionAmount.max,
        e.maxReason = 'Exceeds wallet balance',
        e.isExchange && _.get(e.exchangeMarketInfo, 'max'))
      {
        var n = new BigNumber(_.get(e.exchangeMarketInfo, 'max'));
        n.lt(e.maxSendAmount) && (e.maxSendAmount = n,
            e.maxReason = 'Exceeds ShapeShift maximum'),
          e.maxSendAmount = BigNumber.min(e.maxSendAmount, n)
      }
    }

    function m()
    {
      e.isExchange && _.get(e.exchangeMarketInfo, 'min') ? (e.minSendAmount = new BigNumber(_.get(e.exchangeMarketInfo, 'min')),
        e.minReason = 'Below ShapeShift minimum') : (e.minSendAmount = l.getDust(e.currency),
        e.minReason = 'Below dust limit')
    }

    function g()
    {
      e.buttonText = 'Trade',
        e.isExchange || (e.isExchange = !0,
          !e.tokenPresent && (e.showLogin = !0),
          d.validateRegion()),
        e.exchangeMarketInfo = u.getExchangeMarketInfo(e.currency, e.destinationCurrency)
    }

    function h()
    {
      e.buttonText = 'Transfer',
        e.isExchange = !1,
        d.reset(),
        e.exchangeMarketInfo = u.getExchangeMarketInfo(e.currency, e.destinationCurrency)
    }

    function b()
    {
      e.buttonText = 'Send',
        e.isExchange = !1,
        d.reset(),
        e.exchangeMarketInfo = u.getExchangeMarketInfo(e.currency, e.currency)
    }

    function f()
    {
      e.isExchange && (e.estimatedReceiveAmount = u.estimateReceiveAmount(e.userInput.amount, e.currency, e.destinationCurrency))
    }

    function y()
    {
      if (e.wallet.id)
      {
        var n = l.unformatAmount(e.currency, e.userInput.amount);
        c.compute(e.wallet.id, t.subaccount, n)
      }
    }

    function w()
    {
      e.wallet.id && (c.getMaximumTransactionAmount(e.wallet.id, t.subaccount, e.userInput.feeLevel),
        c.compute(e.wallet.id, t.subaccount, l.unformatAmount(e.currency, e.userInput.amount)))
    }
    if (pinLock.state === pinLock.verifying)
    {
      e.preparingTransaction = true;
      e.progress = progress;
    }
    else
    {
      e.preparingTransaction = false;
      o.reload(undefined, t.wallet);
    }
      e.feeLevels = [],
      e.estimatedFee = c.estimatedFee,
      e.isExchange = !1,
      e.exchangeStatus = d.status,
      e.enableExchangeButton = !0,
      d.reset(),
      e.tokenPresent = !!p.value(),
      e.showLogin = !1,
      e.loginToSS = p.login,
      e.$watch(function()
      {
        return p.value()
      }, function()
      {
        e.showLogin = !p.value()
      }, !1),
      e.maxSendAmount = 0,
      e.maxReason = 'loading...',
      e.minSendAmount = 0,
      e.minReason = 'loading...',
      e.walletId = t.wallet;
    var k = o.getWalletById(e.walletId);
    e.wallet = t.subaccount ? _.find(k.subAccounts,
      {
        coinType: t.subaccount
      }) : k,
      e.currency = e.wallet.coinType,
      e.currencySymbol = l.getCurrencySymbol(e.currency),
      e.singleAccount = 1 === o.wallets.length,
      e.showForm = !e.wallet.highConfidenceBalance.isEqualTo(0),
      e.fresh = o.getFreshStatus(),
      e.buttonText = 'Send',
      e.supportsSecureTransfer = r.get('deviceCapabilities.supportsSecureAccountTransfer'),
      e.oldFirmwareVersion = r.features.firmwareUpdateAvailable,
      e.vendorName = r.get('deviceCapabilities.vendorName'),
      e.supportsSecureExchange = r.getPolicySetting('ShapeShift'),
      e.showSecurityWarning = !e.supportsSecureTransfer || !e.supportsSecureExchange,
      e.config = s,
      e.userInput = {
        sourceIndex: e.walletId,
        sourceName: e.wallet.name,
        address: '',
        amount: '',
        feeLevel: e.config.regularFeeLevel
      },
      e.destinationCurrency = '',
      e.accountCurrencyUrl = 'assets/currency-logos/' + e.currency.toLowerCase() + '.png',
      e.buildTransaction = function()
      {
        if (e.form.$submitted = !0,
          e.form.$valid)
        {
          e.preparingTransaction = !0,
          progress.clear(),
          e.progress = progress,
            i.transactionInProgress = {
              accountId: e.wallet.id,
              amount: l.unformatAmount(e.currency, e.userInput.amount),
              feeLevel: e.userInput.feeLevel
            },
            t.subaccount && (i.transactionInProgress.subAccount = t.subaccount);
          var o = _.get(e.userInput, 'address.id'),
            c = _.get(e.userInput, 'address.coinType');
          o ? (i.transactionInProgress.sendToAccount = o,
              c && (i.transactionInProgress.sendToCurrency = c)) : i.transactionInProgress.sendTo = e.userInput.address,
            e.isExchange ? n.requestCurrencyExchange(i.transactionInProgress) : n.requestTransactionSignature(i.transactionInProgress),
            a.setNextTransition('slideLeft')
        }
      },
      e.setFeeLevel = function(t)
      {
        e.userInput.feeLevel = t
      },
      e.getFee = function(t)
      {
        return _.get(e, 'estimatedFee.fee.' + t) || 0
      },
      e.getFeeCurrency = function()
      {
        return _.get(e, 'estimatedFee.fee.currency')
      },
      e.exchangeDenied = function()
      {
        return e.isExchange && !d.status.exchangeAllowed
      },
      e.showFee = function()
      {
        try
        {
          var t = l.unformatAmount(e.currency, e.userInput.amount);
          return 0 < e.getFee(e.userInput.feeLevel) && t.lte(e.maxSendAmount) && t.gte(e.minSendAmount)
        }
        catch (t)
        {
          return console.log(t),
            !1
        }
      },
      e.wallet.id && c.getMaximumTransactionAmount(e.wallet.id, t.subaccount, e.userInput.feeLevel),
      e.$watch(function()
      {
        return d.status.errorCode
      }, function()
      {
        e.enableExchangeButton = d.status.errorCode === d.NO_VALIDITY_ERROR
      }),
      e.$watchGroup(['destinationCurrency', 'userInput.address.isExchange'], function()
      {
        e.destinationCurrency ? e.userInput.address.isExchange ? g() : h() : b()
      }),
      e.$watch(function()
      {
        return _.get(c, 'maxTransactionAmount.max')
      }, v, !0),
      e.$watch('destinationCurrency', function()
      {
        return 'undefined' == typeof e.destinationCurrency ? e.destinationCurrencyUrl = '' : void(e.destinationCurrencySymbol = l.getCurrencySymbol(e.destinationCurrency),
          e.destinationCurrencyUrl = 'assets/currency-logos/' + e.destinationCurrency.toLowerCase() + '.png')
      }),
      e.$watch('wallet.id', w),
      e.$watch('wallet.id', y),
      e.$watch('wallet.id', v),
      e.$watch('wallet.id', function()
      {
        c.feeLevelsForAccount(e.wallet.id, t.subaccount),
          e.feeLevels = c.feeLevels
      }),
      e.$watch('exchangeMarketInfo', f, !0),
      e.$watch('exchangeMarketInfo', v, !0),
      e.$watch('exchangeMarketInfo', m, !0),
      e.$watch('userInput.amount', y),
      e.$watch('userInput.amount', f),
      e.$watch('userInput.address', f, !0),
      e.$watch('userInput.address', function()
      {
        e.destinationCurrency = _.get(e.userInput.address, 'coinType')
      }),
      e.$watch('userInput.address', v, !0),
      e.$watch('userInput.address', m, !0),
      e.$watch('userInput.address', y, !0),
      e.$watch('userInput.feeLevel', y, !0),
      e.$watch('userInput.feeLevel', v, !0),
      e.$watch('userInput.feeLevel', w)
  }]),
  angular.module('kkWallet').controller('ViewXPubController', ['$rootScope', '$scope', '$routeParams', '$location', 'DeviceBridgeService', 'WalletNodeService', 'NavigationService', 'XPubAddressService', 'PinLockService', function(e, t, n, a, o, i, c, l, pinLock)
  {
    c.setNextTransition('slideLeft'),
      new ClipboardJS('.copy-to-clipboard-button');
    var d = new Promise(function(t)
      {
        e.$on('ButtonRequest', function(e, n)
        {
          'ButtonRequest_Address' === n.code && t(n.code)
        })
      }),
      u = !1;
      t.currency = i.getWalletById(n.walletId).coinType
      switch(pinLock.state)
      {
        case pinLock.idling:
          l.clear()
          o.getPublicKey(n.walletId)
          break;
        case pinLock.cancelling:
          c.goToPrevious('slideRight')
          return;
        case pinLock.verifying:
          break;
      }
      t.$on('$destroy', function()
      {
        var ignorable =
        [
          '/pin/pin_matrix_request_type_current',
          '/passphrase',
          '/failure/invalid_pin'
        ]
        !u && d &&
        _.indexOf(ignorable, a.path()) === -1 &&
        (l.clear(), d.then(o.cancel))
      }),
      t.$watch(l.value, function()
      {
        t.unusedAddress = l.value
      }, !0)
  }]),
  angular.module('kkWallet').controller('SuccessController', ['$scope', '$routeParams', 'NavigationService', 'WalletNodeService', function(e, t, n)
  {
    e.message = decodeURIComponent(t.message),
      n.setNextTransition('slideLeft')
  }]),
  angular.module('kkWallet').config(['DeviceBridgeServiceProvider', function(e)
  {
    function t(e, transit)
    {
      return ['NavigationService', function(t)
      {
        var n = e;
        for (var a in this.request.message)
          this.request.message.hasOwnProperty(a) && (n = n.replace(':' + a, encodeURIComponent(_.snakeCase(this.request.message[a]))));
        t.go(n, transit)
      }]
    }

    function n()
    {
      return ['NavigationService', function(e)
      {
        e.goToPrevious('slideRight')
      }]
    }
    e.when('disconnected', ['$injector', 'WalletNodeService', 'DeviceFeatureService', 'ShapeShiftAuthTokenService', function(e, n, a, o)
      {
        n.clear(),
          a.clear(),
          o.clearCachedToken(),
          e.invoke(t('/connect'), this)
      }]),
      e.when('PinMatrixRequest', t('/pin/:type', 'slideLeft')),
      e.when('PassphraseRequest', t('/passphrase', 'slideLeft')),
      e.when('ButtonRequest', ['$injector', 'PinLockService', function(e, pinLock)
      {
        if ('ButtonRequest_Address' !== this.request.message.code &&
            'ButtonRequest_Other' !== this.request.message.code)
        {
          var n, a = _.get(this, 'request.message.data');
          if ('ButtonRequest_ConfirmOutput' === this.request.message.code)
            pinLock.reset();
          a ? (n = a.split(':'),
            this.request.message.policy = n[0],
            this.request.message.state = n[1],
            e.invoke(t('/buttonRequest/:code/:policy/:state'), this)) : e.invoke(t('/buttonRequest/:code'), this)
        }
      }]),
      e.when('WordRequest', t('/wordRequest')),
      e.when('CharacterRequest', t('/characterRequest/:word_pos/:character_pos')),
      e.when('Success', ['$injector', 'NotificationMessageService', 'WalletNodeService', 'DeviceBridgeService', function(e, a, o, br)
      {
        function i()
        {
          if (!o.wallets.length) return
          c = '/walletList'
        }
        var c;
        switch (this.request.message.message)
        {
          case 'Device wiped':
            a.set('Your KeepKey was successfully wiped!'),
              c = '/initialize';
            break;
          case 'Settings applied':
            a.set('Your device settings were successfully changed!');
              if (o.wallets.length)
              {
                c = '/device';
                br.initialize();
              }
              else c = '/lifeboat';
            break;
          case 'PIN changed':
            a.set('Your PIN was successfully changed!'),
              c = '/device';
            break;
          case 'Session cleared':
            a.set('Your session was successfully cleared!');
            break;
          case 'Policies applied':
            a.set('Your device policies were updated!');
          case 'Device reset':
          case 'Device recovered':
            i();
            break;
          case 'Transaction sent':
            o.setUnfresh(),
              a.set('Your transaction was successfully sent!'),
              i();
            break;
          case 'Account name updated':
            e.invoke(n(), this);
            break;
          default:
            c = '/success/:message';
        }
        c && e.invoke(t(c), this)
      }]),
      e.when('Conflicting Application', t('/conflict'), this),
      e.when('Failure', ['$injector', 'FailureMessageService', 'NavigationService', function(e, a, o)
      {
        var i = this.request.message.message || '',
          c = _.find([
          {
            message: 'Firmware erase cancelled',
            action: 0
          },
          {
            message: 'PIN Cancelled',
            action: 0
          },
          {
            message: 'Signing cancelled by user',
            action: 1
          },
          {
            message: 'Signing cancelled by user.',
            action: 1
          },
          {
            message: 'Wipe cancelled',
            action: 0
          },
          {
            message: 'Reset cancelled',
            action: 0
          },
          {
            message: 'Recovery cancelled',
            action: 0
          },
          {
            message: 'Apply settings cancelled',
            action: 0
          },
          {
            message: 'PIN change cancelled',
            action: 0
          },
          {
            message: 'Exchange cancelled',
            action: 0
          },
          {
            message: 'Show address cancelled',
            action: 1
          },
          {
            message: 'Show extended public key cancelled',
            action: 1
          },
          {
            message: 'Aborted',
            action: 1
          },
          {
            message: 'Exchange transaction cancelled',
            action: 0
          }], function(e)
          {
            return i.endsWith(e.message)
          });
        switch (_.get(c, 'action'))
        {
          case 0:
            e.invoke(n(), this);
          case 1:
            return;
          default:
            a.add(this.request.message),
              o.setNextDestination(),
              o.setNextTransition('cross-fade'),
              e.invoke(t('/failure/:message'), this);
        }
      }]),
      e.when('TxRequest', ['NavigationService', 'TransactionService', function(e, t)
      {
        'TXFINISHED' === this.request.message.request_type && (angular.copy(
          {}, t.transactionInProgress),
          e.go('/walletlist'))
      }]),
      e.when('Features', ['EntryPointNavigationService', 'DeviceFeatureService', function(e, t)
      {
        t.set(this.request.message),
          e.goToTop(!0)
      }]),
      e.when('ImageHashCode', ['ProxyInfoService', function(e)
      {
        e.set(this.request.message)
      }]),
      e.when('ping', function() {}),
      e.when('WalletNodes', ['WalletNodeService', function(e)
      {
        e.updateWalletNodes(this.request.message, this.request.messageIsFresh)
      }]),
      e.when('ValidatedExchangeRegion', ['ExchangeValidityService', function(e)
      {
        e.set(this.request.message)
      }]),
      e.when('AvailableFeeLevels', ['FeeService', function(e)
      {
        e.setAvailableFeeLevels(this.request.message)
      }]),
      e.when('EstimatedTransactionFee', ['FeeService', function(e)
      {
        e.setEstimate(this.request.message)
      }]),
      e.when('MaximumTransactionAmount', ['FeeService', function(e)
      {
        e.setMaxTransactionAmount(this.request.message)
      }]),
      e.when('ExchangeMarketInfo', ['ExchangeMarketInfoService', function(e)
      {
        e.setExchangeMarketInfo(this.request.message)
      }]),
      e.when('Processed', ['ProgressService', function(e)
      {
        e.update(this.request.message)
      }]),
      e.when('RequestCurrencyExchangeConfirmation', ['NavigationService', 'ExchangeService', function(e, t)
      {
        t.set(this.request.message),
          e.go('/confirm-exchange')
      }]),
      e.when('Address', ['PinLockService', function(pinLock)
      {
        if (pinLock.state === pinLock.verifying)
          pinLock.reset();
      }]),
      e.when('ReceiveAddress', ['ReceiveAddressService', function(e)
      {
        e.set(this.request.message)
      }]),
      e.when('PublicKey', ['XPubAddressService', function(e)
      {
        e.set(this.request.message)
      }]),
      e.when('BlockcypherApiToken', ['DeviceFeatureService', function(e)
      {
        e.setBlockcypherApiToken(this.request.message.token)
      }]),
      e.when('VerifyDeviceStatus', ['VerifyDeviceStatusService', function(e)
      {
        e.set(this.request.message)
      }]),
      e.when('ShapeShiftAuthToken', ['ShapeShiftAuthTokenService', function(e)
      {
        e.set(this.request.message.token)
      }]),
      e.when('unknownSender', function()
      {
        this.sendResponse(
        {
          messageType: 'Error',
          result: 'Unknown sender ' + this.sender.id + ', message rejected'
        })
      }),
      e.when('unknownMessageType', function()
      {
        this.sendResponse(
        {
          messageType: 'Error',
          result: 'Unknown messageType ' + this.request.messageType + ', message rejected'
        })
      })
  }]),
  angular.module('kkWallet').factory('DeviceFeatureService', ['VERSION', 'environmentConfig', 'CurrencyLookupService', function(e, t, n)
  {
    function a()
    {
      var e = [o.major_version, o.minor_version, o.patch_version].join('.');
      if (!o.deviceCapabilities.firmwareImageAvailable)
        return !1;
      for (var t = 0; t < o.available_firmware_versions.length; t++)
        if (semver.gt(o.available_firmware_versions[t], e))
          return !0;
      return !1
    }
    var o = {},
      i = !0;
    return {
      features: o,
      get: function t(e)
      {
        return _.get(o, e)
      },
      set: function s(c)
      {
        angular.copy(c, o),
          o.wallet_version = e,
          o.environment = t.environment,
          o.firmwareUpdateAvailable = a(),
          n.set(o.coin_metadata),
          o.bootloader_mode || (i = o.initialized)
      },
      getPolicySetting: function n(e)
      {
        var t = _.find(o.policies,
        {
          policy_name: e
        });
        return t && t.enabled
      },
      clear: function s()
      {
        var e = !0,
          t = !1,
          n = void 0;
        try
        {
          for (var a, i, c = Object.getOwnPropertyNames(o)[Symbol.iterator](); !(e = (a = c.next()).done); e = !0)
            i = a.value,
            delete o[i]
        }
        catch (e)
        {
          t = !0,
            n = e
        }
        finally
        {
          try
          {
            !e && c.return && c.return()
          }
          finally
          {
            if (t)
              throw n
          }
        }
      },
      setBlockcypherApiToken: function t(e)
      {
        o.blockcypher_api_token = e
      },
      initializedDeviceHasBeenConnected: function e()
      {
        return console.log('initialized device: ' + i),
          i
      }
    }
  }]),
  angular.module('kkWallet').factory('EntryPointNavigationService', ['NavigationService', 'DeviceFeatureService', 'DeviceBridgeService', 'DynamicConfigurationService', 'ShapeShiftAuthTokenService', function(e, t, n, a, o)
  {
    return {
      goToTop: async function s(i)
      {
        var c = await a.get();
        e.dumpHistory(),
          t.get('deviceCapabilities.prereleaseDevice') ? e.go('/prerelease-device') : t.get('bootloader_mode') ? e.go('/bootloader') : t.get('deviceCapabilities.newKeepKey') ? e.go('/verify-device') : function()
          {
            return i && (t.get('firmwareUpdateAvailable') || t.get('bootloaderInfo.upgradable') && !c.disableBootloaderUpdate)
          }() ? e.go('/update-device') : t.get('deviceCapabilities.firmwareBorken') ? e.go('/bad-firmware') : t.get('initialized') ? (n.initiateSession(),
            o.fetch(),
            e.go('/walletlist')) : e.go('/initialize')
      }
    }
  }]),
  angular.module('kkWallet').factory('ExchangeValidityService', ['DeviceBridgeService', '$rootScope', function(e, t)
  {
    var n = {
        exchangeAllowed: !0,
        errorCode: '',
        url: ''
      },
      a = {};
    return angular.copy(n, a),
    {
      set: function n(e)
      {
        angular.copy(e, a),
          a.error ? (a.url = a.error.data.url,
            a.errorCode = a.error.code,
            a.exchangeAllowed = !1) : (a.url = '',
            a.errorCode = '',
            a.exchangeAllowed = !0),
          setTimeout(function()
          {
            t.$digest()
          }, 0)
      },
      reset: function e()
      {
        angular.copy(n, a),
          setTimeout(function()
          {
            t.$digest()
          }, 0)
      },
      exchangeAllowed: a.exchangeAllowed,
      status: a,
      PENDING_VALIDITY_CHECK: 'pending',
      NO_VALIDITY_ERROR: '',
      validateRegion: function n()
      {
        a.errorCode = 'pending',
          setTimeout(function()
          {
            t.$digest()
          }, 0),
          e.isValidExchangeRegion()
      }
    }
  }]),
  angular.module('kkWallet').factory('FailureMessageService', function()
  {
    var e = [];
    return {
      get: function t()
      {
        return e
      },
      add: function n(t)
      {
        e.push(t)
      },
      clear: function t()
      {
        e.length = 0
      }
    }
  }),
  angular.module('kkWallet').factory('FeeService', ['$rootScope', 'DeviceBridgeService', function(e, t)
  {
    var n = {},
      a = {},
      o = {},
      i = [];
    return {
      fees: n,
      estimatedFee: a,
      maxTransactionAmount: o,
      feeLevels: i,
      set: function a(t)
      {
        angular.copy(t, n),
          setTimeout(function()
          {
            e.$digest()
          }, 0)
      },
      setEstimate: function n(t)
      {
        angular.copy(t, a),
          setTimeout(function()
          {
            e.$digest()
          }, 0)
      },
      setMaxTransactionAmount: function n(t)
      {
        angular.copy(t, o),
          setTimeout(function()
          {
            e.$digest()
          }, 0)
      },
      setAvailableFeeLevels: function n(t)
      {
        angular.copy(t, i),
          setTimeout(function()
          {
            e.$digest()
          }, 0)
      },
      feeLevelsForAccount: t.feeLevelsForAccount,
      compute: t.estimateFeeForTransaction,
      getMaximumTransactionAmount: t.getMaximumTransactionAmount
    }
  }]),
  angular.module('kkWallet').config(['$routeProvider', function(e)
  {
    e.caseInsensitiveMatch = !0,
      e.when('/',
      {
        templateUrl: 'app/popup/connect/connect.tpl.html'
      }).when('/connect',
      {
        templateUrl: 'app/popup/connect/connect.tpl.html'
      }).when('/device',
      {
        templateUrl: 'app/popup/device/device.tpl.html',
        goable: !0
      }).when('/lifeboat',
      {
        templateUrl: 'app/popup/device/lifeboat.tpl.html',
        goable: !0
      }).when('/initialize',
      {
        templateUrl: 'app/popup/initialize/initialize.tpl.html',
        goable: !0
      }).when('/bootloader',
      {
        templateUrl: 'app/popup/bootloader/bootloader.tpl.html'
      }).when('/buttonRequest/button_request_confirm_word',
      {
        templateUrl: 'app/popup/buttonRequest/confirmWord.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_wipe_device',
      {
        templateUrl: 'app/popup/buttonRequest/wipeDevice.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_firmware_erase',
      {
        templateUrl: 'app/popup/buttonRequest/firmwareErase.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_confirm_output',
      {
        templateUrl: 'app/popup/buttonRequest/confirmOutput.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_sign_tx',
      {
        templateUrl: 'app/popup/buttonRequest/signTx.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_sign_exchange',
      {
        templateUrl: 'app/popup/buttonRequest/sign-exchange.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_fee_over_threshold',
      {
        templateUrl: 'app/popup/buttonRequest/feeOverThreshhold.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_protect_call',
      {
        templateUrl: 'app/popup/buttonRequest/generic.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_change_pin',
      {
        templateUrl: 'app/popup/buttonRequest/changePin.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_change_label',
      {
        templateUrl: 'app/popup/buttonRequest/changeLabel.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_auto_lock_delay_ms',
      {
        templateUrl: 'app/popup/buttonRequest/changePinTimeout.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_enable_passphrase',
      {
        templateUrl: 'app/popup/buttonRequest/enablePassphrase.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_disable_passphrase',
      {
        templateUrl: 'app/popup/buttonRequest/disablePassphrase.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_confirm_transfer_to_account',
      {
        templateUrl: 'app/popup/buttonRequest/confirmTransferToAccount.tpl.html',
        goable: !1
      }).when('/buttonRequest/button_request_apply_policies/:policy/:state',
      {
        templateUrl: 'app/popup/buttonRequest/apply-policy.tpl.html',
        goable: !1
      }).when('/buttonRequest/:code',
      {
        templateUrl: 'app/popup/buttonRequest/buttonRequest.tpl.html',
        goable: !1
      }).when('/characterRequest/:word_pos/:character_pos',
      {
        templateUrl: 'app/popup/characterRequest/characterRequest.tpl.html',
        goable: !1
      }).when('/creating',
      {
        templateUrl: 'app/popup/creating/creating.tpl.html'
      }).when('/failure/firmware_erase_cancelled',
      {
        templateUrl: 'app/popup/failure/firmwareEraseCancelled.tpl.html',
        goable: !1
      }).when('/failure/pin_change_failed',
      {
        templateUrl: 'app/popup/failure/pinConfirmationFailed.tpl.html',
        goable: !1
      }).when('/failure/invalid_pin',
      {
        templateUrl: 'app/popup/failure/pinInvalid.tpl.html',
        goable: !1
      }).when('/failure/bip44_account_gap_violation/:previousAccountName',
      {
        templateUrl: 'app/popup/failure/Bip44AccountGapViolation.tpl.html',
        goable: !0
      }).when('/failure/transaction_must_have_at_least_one_input',
      {
        templateUrl: 'app/popup/failure/MustHaveAtLeastOneInput.tpl.html',
        goable: !1
      }).when('/failure/unable_to_initialize',
      {
        templateUrl: 'app/popup/failure/UnableToInitialize.tpl.html',
        goable: !0
      }).when('/failure/:message',
      {
        templateUrl: 'app/popup/failure/failure.tpl.html',
        goable: !1
      }).when('/walletlist',
      {
        templateUrl: 'app/popup/walletlist/walletlist.tpl.html',
        goable: !0
      }).when('/wallet/:wallet',
      {
        templateUrl: 'app/popup/wallet/wallet.tpl.html',
        goable: !0
      }).when('/send/:wallet',
      {
        templateUrl: 'app/popup/send/send.tpl.html',
        goable: !0
      }).when('/send/:wallet/:subaccount',
      {
        templateUrl: 'app/popup/send/send.tpl.html',
        goable: !0
      }).when('/wordRequest',
      {
        templateUrl: 'app/popup/wordRequest/wordRequest.tpl.html'
      }).when('/sending',
      {
        templateUrl: 'app/popup/sending/sending.tpl.html'
      }).when('/success/bouncies',
      {
        templateUrl: 'app/popup/success/buildingTransaction.tpl.html',
        goable: !1
      }).when('/success/firmware_erased',
      {
        templateUrl: 'app/popup/success/updatingFirmware.tpl.html',
        goable: !1
      }).when('/success/upload_complete',
      {
        templateUrl: 'app/popup/success/uploadComplete.tpl.html',
        goable: !1
      }).when('/success/:message',
      {
        templateUrl: 'app/popup/success/success.tpl.html',
        goable: !1
      }).when('/receive/:walletId/:addressDepth',
      {
        templateUrl: 'app/popup/receive/receive.tpl.html',
        goable: !0
      }).when('/receive/:walletId',
      {
        templateUrl: 'app/popup/receive/receive.tpl.html',
        goable: !0
      }).when('/xpub/:walletId',
      {
        templateUrl: 'app/popup/xpub/xpub.tpl.html',
        goable: !0
      }).when('/pin/pin_matrix_request_type_new_first',
      {
        templateUrl: 'app/popup/pin/newPin.tpl.html',
        goable: !1
      }).when('/pin/pin_matrix_request_type_new_second',
      {
        templateUrl: 'app/popup/pin/confirmPin.tpl.html',
        goable: !1
      }).when('/pin/:type',
      {
        templateUrl: 'app/popup/pin/pin.tpl.html',
        goable: !1
      }).when('/passphrase',
      {
        templateUrl: 'app/popup/passphrase/passphrase.tpl.html',
        goable: !1
      }).when('/selectWordCount/:nextAction',
      {
        templateUrl: 'app/popup/selectWordCount/selectWordCount.tpl.html',
        goable: !0
      }).when('/label/:nextAction',
      {
        templateUrl: 'app/popup/label/label.tpl.html',
        goable: !0
      }).when('/pin-timeout',
      {
        templateUrl: 'app/popup/pin-timeout/pin-timeout.tpl.html'
      }).when('/syncing',
      {
        templateUrl: 'app/popup/syncing/syncing.tpl.html'
      }).when('/passphrase',
      {
        templateUrl: 'app/popup/passphrase/passphrase.tpl.html',
        goable: !1
      }).when('/support',
      {
        templateUrl: 'app/popup/support/support.tpl.html',
        goable: !0
      }).when('/accountConfig/:accountId',
      {
        templateUrl: 'app/popup/accountConfig/updateAccount.tpl.html',
        goable: !0
      }).when('/accountConfig',
      {
        templateUrl: 'app/popup/accountConfig/addAccount.tpl.html',
        goable: !0
      }).when('/exchange',
      {
        templateUrl: 'app/popup/exchange/exchange.tpl.html',
        goable: !0
      }).when('/update-device',
      {
        templateUrl: 'app/popup/update-device/update-device.tpl.html',
        goable: !0
      }).when('/preparing',
      {
        templateUrl: 'app/popup/preparing/preparing.tpl.html',
        goable: !1
      }).when('/prerelease-device',
      {
        templateUrl: 'app/popup/prerelease-device/prerelease-device.tpl.html',
        goable: !1
      }).when('/confirm-exchange',
      {
        templateUrl: 'app/popup/confirm-exchange/confirm-exchange.tpl.html',
        goable: !1
      }).when('/acknowledgements',
      {
        templateUrl: 'app/popup/acknowledgements/acknowledgements.tpl.html',
        goable: !0
      }).when('/conflict',
      {
        templateUrl: 'app/popup/disable-conflicting/conflicting-message.tpl.html',
        goable: !1
      }).when('/about',
      {
        templateUrl: 'app/popup/about/about.tpl.html',
        goable: !0
      }).when('/verify-device',
      {
        templateUrl: 'app/popup/verify/verify.tpl.html',
        goable: !1
      }).when('/bad-firmware',
      {
        templateUrl: 'app/popup/bad-firmware/bad-firmware.tpl.html',
        goable: !1
      }).otherwise(
      {
        redirectTo: '/',
        goable: !1
      })
  }]),
  angular.module('kkWallet').factory('NotificationMessageService', function()
  {
    var e = '';
    return {
      get: function t()
      {
        return e
      },
      set: function n(t)
      {
        e = t
      },
      clear: function t()
      {
        e = ''
      }
    }
  }),
  angular.module('kkWallet').factory('ProgressService', ['$rootScope', function(e)
  {
    var t = {
      update: function(n)
      {
        t.current = n.current,
          t.total = n.total,
          e.$apply()
      },
      clear: function()
      {
        t.current = 0,
          t.total = 0
      },
      current: 0,
      total: 0
    };
    return t
  }]),
  angular.module('kkWallet').factory('ProxyInfoService', function()
  {
    var e = {};
    return {
      info: e,
      set: function n(t)
      {
        angular.copy(t, e)
      }
    }
  }),
  angular.module('kkWallet').factory('SupportService', function()
  {
    return {
      webLink: 'https://help.keepkey.com/',
      emailAddress: 'support@keepkey.com',
      launchSupportTab: function e()
      {
        window.open('https://help.keepkey.com/', '_blank')
      },
      openEmail: function e()
      {
        window.open('mailto:support@keepkey.com')
      }
    }
  }),
  angular.module('kkWallet').factory('TransactionService', ['$rootScope', 'DeviceBridgeService', function()
  {
    return {
      transactionInProgress:
      {}
    }
  }]),
  angular.module('kkWallet').factory('VerifyDeviceStatusService', ['$rootScope', function(e)
  {
    var t = {};
    return {
      set: function a(n)
      {
        angular.copy(n, t),
          e.$digest()
      },
      status: t
    }
  }]),
  angular.module('kkWallet').factory('DynamicConfigurationService', ['$rootScope', '$http', function()
  {
    return {
      get: async function e()
      {
        return {
          disableBootloaderUpdate: !1
        }
      }
    }
  }]),
  angular.module('kkWallet').factory('ExchangeMarketInfoService', ['$rootScope', 'DeviceBridgeService', 'CurrencyLookupService', function(e, t, n)
  {
    function a(e, t)
    {
      var n = o[e + '_' + t];
      return n
    }
    var o = {};
    return {
      exchangeMarketInfoDictionary: o,
      setExchangeMarketInfo: function o(t)
      {
        var n = a(t.depositCurrency, t.withdrawalCurrency);
        console.assert(n, 'market info data object for ' + t.depositCurrency + ' => ' + t.withdrawalCurrency + ' should be defined'),
          angular.copy(t, n),
          e.$digest()
      },
      getExchangeMarketInfo: function s(e, n)
      {
        var i = e + '_' + n,
          c = a(e, n);
        return c || (c = {},
            o[i] = c),
          e !== n && t.getExchangeMarketInfo(i),
          c
      },
      estimateReceiveAmount: function u(e, t, o)
      {
        var i = a(t, o);
        if (e && i)
        {
          var c = new BigNumber(e),
            s = n.formatAmount(o, i.rate),
            r = c.times(s),
            l = n.formatAmount(o, i.minerFee),
            d = r.minus(l);
          return d.gt(0) ? n.unformatAmount(o, d).toString() : ''
        }
        return ''
      }
    }
  }]),
  angular.module('kkWallet').factory('ExchangeService', ['$rootScope', function()
  {
    function e(e)
    {
      return n && e ? n.get(e) : void 0
    }

    function t()
    {
      return n
    }
    var n;
    return {
      set: function(e)
      {
        n = _(e)
      },
      get: e,
      getRequest: t
    }
  }]),
  angular.module('kkWallet').factory('ReceiveAddressService', [function()
  {
    var e = {};
    return {
      set: function n(t)
      {
        angular.copy(t, e)
      },
      clear: function t()
      {
        angular.copy(
        {}, e)
      },
      value: e
    }
  }]),
  angular.module('kkWallet').factory('XPubAddressService', [function()
  {
    var e = {};
    return {
      set: function n(t)
      {
        angular.copy(t, e)
      },
      clear: function t()
      {
        angular.copy(
        {}, e)
      },
      value: e
    }
  }]),
  angular.module('kkWallet').factory('PinLockService', [function()
  {
    var validStates = {idle: 0, verify: 1, cancel: 2};
    var currState = validStates.idle;
    var pinLock =
    {
      reset: function() { currState = validStates.idle },
      idling:     validStates.idle,
      verifying:  validStates.verify,
      cancelling: validStates.cancel
    }
    return Object.defineProperty(pinLock, "state",
    {
      get: function()
      {
        return currState || validStates.idle;
      },
      set: function(s)
      {
        if (s in Object.values(validStates)) currState = s;
      }
    })
  }]),
  angular.module('kkWallet').factory('ShapeShiftAuthTokenService', ['DeviceBridgeService', '$rootScope', 'environmentConfig', 'membershipPlatform', function(e, t, n, a)
  {
    var o = a.url,
      i = a.clientId,
      c = o + '/oauth/authorize?response_type=token&scope=users:read&client_id=' + i + '&redirect_uri=https://' + chrome.runtime.id + '.chromiumapp.org/',
      s = void 0,
      r = function(e)
      {
        if (!e)
          return null;
        var t = /#access_token(=([^&#]*)|&|#|$)/,
          n = t.exec(e);
        return n && n[2] ? n[2] : null
      },
      l = function(n)
      {
        s = n,
          e.setShapeShiftAuthToken(n),
          t.$digest()
      },
      d = function()
      {
        s || e.getShapeShiftAuthToken()
      },
      u = function()
      {
        return s
      };
    return {
      login: function e()
      {
        chrome.identity.launchWebAuthFlow(
        {
          url: c,
          interactive: !0
        }, function(e)
        {
          var t = r(e);
          l(t),
            chrome.runtime.lastError && console.log('Authorization Error: ', chrome.runtime.lastError)
        })
      },
      put: l,
      value: u,
      set: function n(e)
      {
        s = e,
          t.$digest()
      },
      fetch: d,
      clear: function t()
      {
        s = void 0,
          e.clearShapeShiftAuthToken(),
          chrome.identity.launchWebAuthFlow(
          {
            url: o + '/api/v1/logout',
            interactive: !1
          }, function()
          {
            console.log('logout complete')
          })
      },
      clearCachedToken: function e()
      {
        s = void 0
      }
    }
  }]),
  angular.module('kkWallet').factory('ShapeshiftAvailabilityService', ['$rootScope', '$http', 'CurrencyLookupService', function(e, t, n)
  {
    function a()
    {
      c || (c = !0,
        t.get('https://shapeshift.io/getcoins').then(function(t)
        {
          i = !1,
            Object.keys(t.data).forEach(function(e)
            {
              angular.copy(t.data[e], o[e])
            }),
            setTimeout(function()
            {
              e.$digest(),
                c = !1
            }),
            setTimeout(function()
            {
              return i = !0
            }, 30000)
        }))
    }
    var o = {},
      i = !0,
      c = !1;
    return {
      data: o,
      get: function s(e)
      {
        var t = n.getCurrencySymbol(e),
          c = _.get(o, t);
        return c ? i && a() : (o[t] = c = {},
            a()),
          c
      }
    }
  }]),
  angular.module('kkWallet').controller('SupportController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'SupportService', 'PinLockService', function(e, t, n, a, o, pinLock)
  {
    if (pinLock.state === pinLock.cancelling)
    {
      a.goToPrevious('slideRight')
      return;
    }

    e.showApiToken = !1,
      '/device' === a.getPreviousRoute() && (n.getBlockcypherApiToken(),
        e.showApiToken = !0),
      e.backDestination = a.getPreviousRoute(),
      e.supportEmailAddress = o.emailAddress,
      e.supportWebLink = o.webLink,
      e.supportName = 'KeepKey' === t.get('deviceCapabilities.vendorName') ? 'Your KeepKey' : 'The KeepKey Chrome Wallet',
      e.launchSupportTab = o.launchSupportTab,
      e.openEmail = o.openEmail,
      e.device = t.features
  }]),
  angular.module('kkWallet').controller('CreatingCtrl', function() {}),
  angular.module('kkWallet').controller('UpdateDeviceCtrl', ['$scope', 'DeviceFeatureService', 'EntryPointNavigationService', function(e, t, n)
  {
    e.skipable = !0,
      t.get('firmwareUpdateAvailable') && (e.skipable = e.skipable && t.get('deviceCapabilities.upgradeSkipable')),
      t.get('bootloaderInfo.upgradable') && (e.skipable = e.skipable && t.get('bootloaderInfo.upgradeSkipable')),
      e.goToTop = n.goToTop,
      e.deviceWipeRequired = t.get('deviceCapabilities.firmwareBorken')
  }]),
  angular.module('kkWallet').controller('VerifyController', ['$scope', 'DeviceBridgeService', 'VerifyDeviceStatusService', function(e, t, n)
  {
    e.step1Done = !1,
      e.startValidation = function()
      {
        t.verifyDevice()
      },
      e.status = n.status
  }]),
  angular.module('kkWallet').controller('WalletController', ['$scope', '$routeParams', 'WalletNodeService', 'CurrencyLookupService', 'DeviceFeatureService', 'DeviceBridgeService', 'PinLockService', function(e, t, n, a, o, br, pinLock)
  {
    function i()
    {
      return 'Ethereum' === e.wallet.coinType ? 'Ether' : e.wallet.coinType
    }

    function c()
    {
      return 'Ethereum' === e.wallet.coinType ? 'Ether / ERC20 Tokens' : e.wallet.coinType
    }

    function s(t)
    {
      _.isArray(t) && 0 === t.length || (e.wallet = n.getWalletById(e.walletId),
        e.subAccounts = _.sortBy(e.wallet.subAccounts, function(e)
        {
          return e.balance
        }).reverse(),
        e.showSubAccounts = !!e.subAccounts.length,
        e.currency = e.wallet.coinType,
        e.sendCurrencyName = i(),
        e.receiveCurrencyName = c(),
        e.singleAccount = 1 === e.walletList.length)
    }
    pinLock.reset(),
    e.walletList = n.wallets,
      e.walletStats = n.walletStats,
      e.walletId = t.wallet,
      e.fresh = n.getFreshStatus(),
      e.showSubAccounts = !1,
      e.isSingleAddressAccount = 'single' === n.getWalletById(t.wallet).addressStrategy,
      s(),
      e.firmwareUpdateAvailable = o.features.firmwareUpdateAvailable,
      e.offerKeepKeyPurchase = 'KeepKey' !== o.get('deviceCapabilities.vendorName'),
      e.send = function(t)
      {
        t ? e.go(['', 'send', e.walletId, t].join('/'), 'slideLeft') : e.go('/send/' + e.walletId, 'slideLeft')
      },
      e.receive = function()
      {
        e.go(['/receive', e.walletId].join('/'), 'slideLeft')
      },
      e.viewXPub = function()
      {
        e.go(['/xpub', e.walletId].join('/'), 'slideLeft')
      },
      e.sendAllowed = function(t)
      {
        var a = n.getWalletById(e.walletId, t);
        return !a.highConfidenceBalance.isZero()
      },
      e.isToken = function(e)
      {
        return a.isToken(e)
      },
      e.receiveDisabled = function()
      {
        return !1
      },
      e.showTransactions = function(t)
      {
        var n = ['chrome-wallet', 'keepkey.html#!', e.walletId],
          a = ['keepkey-wallet-transactions', e.walletId];
        t && (n.push(t),
            a.push(t)),
          chrome.app.window.create(n.join('/'),
          {
            id: a.join('-'),
            innerBounds:
            {
              minHeight: 200,
              minWidth: 1100
            }
          })
      },
      e.accountSettings = function()
      {
        e.go('/accountConfig/' + e.walletId, 'slideLeft')
      },
      e.$watch('walletId', s, !0),
      e.$watch('walletList', s, !0)
  }]),
  angular.module('kkWallet').controller('WalletConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceBridgeService', function(e, t, n, a)
  {
    e.walletId = t.walletId,
      e.delete = function()
      {
        a.deleteAccount(e.walletId).then(function(t)
        {
          t ? (n.removeAccount(e.walletId),
            e.go('/walletlist', 'slideRight')) : console.error('delete account failed')
        })
      },
      e.$watch('walletId', function()
      {
        e.wallet = n.getWalletById(e.walletId)
      }),
      e.$watch('wallet.name', function()
      {
        a.updateWalletName(e.walletId, e.wallet.name)
      })
  }]),
  angular.module('kkWallet').controller('WalletListController', ['$scope', 'DeviceFeatureService', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'PinLockService', function(e, t, n, a, o, pinLock)
  {
    function i()
    {
      e.walletGroups = _.map(_.groupBy(e.wallets, 'coinType'), function(e, t)
      {
        return {
          coinType: t,
          wallets: e
        }
      })
    }
    e.wallets = o.wallets,
      e.device = t.features,
      e.loaded = !!e.wallets.length,
      e.fresh = o.getFreshStatus(),
      i(),
      e.wallets.length || (pinLock.state === pinLock.verifying) || o.loadAccounts(),
      '/label/initialize' === a.getPreviousRoute() ? a.setNextTransition('slideLeft') : a.setNextTransition('cross-fade'),
      e.showWalletList = function()
      {
        return e.loaded && 1 <= e.wallets.length
      },
      e.goWallet = function(t)
      {
        e.go('/wallet/' + t.id, 'slideLeft')
      },
      e.displayedAccounts = e.wallets,
      e.$watch('wallets.length', function()
      {
        e.loaded = !!e.wallets.length,
          i()
      }),
      e.signup = function(e, n)
      {
        var a = chrome.runtime.getManifest().version,
          o = t.features,
          i = 'v' + o.major_version + '.' + o.minor_version + '.' + o.patch_version;
        window.open(n + '?utm_source=keepkey_client&utm_medium=' + e + '&utm_keyword=client_' + a + '&utm_term=firmware_' + i + '&utm_campaign=fox_launch', '_blank')
      }
  }]),
  angular.module('kkWallet').controller('WordRequestController', ['$scope', 'DeviceBridgeService', function(e, t)
  {
    e.word = '',
      e.send = function()
      {
        return !!e.form.$valid && (t.acknowledgeWord(e.word),
          e.word = '',
          !1)
      }
  }]),
  angular.module('kkWallet').run(['$templateCache', function(e)
  {
    e.put('app/popup/about/about.tpl.html', '<section id=about ng-controller=AboutController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><div class=applogo-icon><img src="/images/icon.png"><div class=applogo-features>About KeepKey<ul><li class="ng-binding">Client: v{{device.wallet_version}}</li><li class="ng-binding">Firmware: {{device.version}}</li><li class="ng-binding">Bootloader: {{device.bootloaderInfo.tag}}</li><li class="ng-binding">Model: {{device.model}}</li></ul></div></div></h2><div class=features><ul><li>Device ID: {{device.device_id}}</li><li>Revision: {{device.revision}}</li><li>Firmware Hash: {{device.firmware_hash}}</li><li>Bootloader Hash: {{device.bootloader_hash}}</li><li>Passphrase Protection: {{device.passphrase_protection ? "enabled" : "disabled"}}</li><li>Pin Protection: {{device.pin_protection ? "enabled" : "disabled"}}</li><li>Initialized: {{device.initialized}}</li></ul></div><div class=menu><ul class=about-sections><li><button class=menu-item ng-click=launchWebsite($event)>Website</button></li><li><button class=menu-item ng-click=launchBlog($event)>Blog</button></li></ul></div><div class=social-media-links><ul><li><i class="fa fa-twitter" ng-click=launchTwitter($event)></i></li><li><i class="fa fa-facebook-f" ng-click=launchFacebook($event)></i></li><li><i class="fa fa-reddit" ng-click=launchReddit($event)></i></li><li><i class="fa fa-youtube" ng-click=launchYoutube($event)></i></li><li><i class="fa fa-github" ng-click=launchGithub($event)></i></li></ul></div></div><div class=footer><div class=left><strong><device-label></device-label></strong> connected</div></div><notification-message></notification-message></section>'),
      e.put('app/popup/acknowledgements/acknowledgements.tpl.html', '<section id=acknowledgement><header><back-button class="button-left header-button" destination="\'/device\'"></back-button></header><div class=content><title>Acknowledgements</title><ul><li>Ethereum blockchain data provided by <a href="https://etherscan.io/" target=_blank>Etherscan.io</a></li><li>Crypto market price feed provided by <a href="https://www.coingecko.com" target=_blank>CoinGecko</a></li><li>Blockchain indexers provided by <a href="https://trezor.io" target="_blank">Trezor</a>, <a href="https://guarda.com" target="_blank">Guarda</a> and <a href="https://atomicwallet.io" target="_blank">AtomicWallet</a></li><li>Cryptocurrency icons provided by <a href="https://github.com/spothq/cryptocurrency-icons" target="_blank">cryptoicons.co</a></li></ul></div><div class=footer><div class=left><strong><device-label></device-label></strong> connected</div></div><notification-message></notification-message></section>'),
      e.put('app/popup/bad-firmware/bad-firmware.tpl.html', '<section id=bad-firmware ng-controller=UpdateDeviceCtrl><div class=content><h2><span class=cornflower-txt><b>Oh no! There\'s a bug...</b></span><p><b>The firmware on your KeepKey has a bug. YOUR FUNDS ARE SAFE. Please stand by while we work to fix it. In the mean, please contact <a href=mailto:support@keepkey.com target=_blank>support@keepkey.com</a> with any questions. We apologize for the inconvenience.</b></p></h2><a class="text-link-button cancel" ng-if=skipable ng-click=goToTop(false)>Skip</a><notification></notification></div></section>'),
      e.put('app/popup/bootloader/bootloader.tpl.html', '<section id=bootloader ng-controller=BootloaderController><div class=content><div class=content-inner><div ng-if=firmwareAvailable><h2><div class=cornflower-txt><b>KeepKey</b> device update.</div><div ng-if=assumingDeviceIsInitialized>If you initialized your KeepKey and previously generated a recovery sentence, make sure you have access to it before proceeding. Device updates may result in your device being wiped, including the private keys stored on it.</div><div ng-if=!assumingDeviceIsInitialized>Update your new KeepKey with the latest software.</div><div class=bootloader-update-message ng-if=showBootloaderButton><div class=cornflower-txt><b>Bootloader Update</b></div>During the bootloader update, please follow the instructions shown on the device. <b>DO NOT</b> unplug the device unless instructed to.<br><br>For more information about the update, please see our <a href="https://www.keepkey.com/2018/06/25/usb-buffer-under-run-vulnerability/" target=_blank>release notes</a>.</div></h2><div class=button-bar><div class=seed-check ng-hide=!assumingDeviceIsInitialized><input type=checkbox ng-model=enableButton> <label>I have my backup sentence in case my KeepKey needs to be recovered.</label></div><a class=button ng-disabled=!enableButton ng-click="enableButton && updateDevice(\'bootloaderUpdater\')" ng-if=showBootloaderButton>Upgrade Bootloader</a><div ng-repeat="version in versionsAvailable"><div ng-if="isUpgrade(version) && showFirmwareButton" class=upgradefw style="{{ enableButton ? \'\' : \'opacity: .25; cursor: not-allowed\' }}" ng-disabled=!enableButton ng-click="enableButton && updateDevice(version)"><span>ShapeShift Beta Compatible</span><div>UPGRADE TO v{{ version }}</div></div><a ng-if="!isUpgrade(version) && showFirmwareButton" class=downgradefw style="{{ enableButton ? \'\' : \'opacity: .25; cursor: not-allowed\' }}" ng-disabled=!enableButton ng-click="enableButton && updateDevice(version)">Downgrade to v{{ version }}</a></div></div></div><div class=content-inner-centering ng-if=!firmwareAvailable><h2><div class=cornflower-txt>No firmware file available</div><div>KeepKey Chrome Wallet doesn\'t have firmware available for your device. Please follow the instructions from the device\'s manufacturer for updating your firmware.</div></h2></div></div><notification></notification></div></section>'),
      e.put('app/popup/accountConfig/addAccount.tpl.html', '<section id=add-account ng-controller=AccountConfigController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Add New Account</b></span> To Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><div class=help>Using accounts helps you organize balances on your device. Account names help you distinguish between accounts.</div><div class=btn-group uib-dropdown is-open=status.isopen><button type=button uib-dropdown-toggle ng-disabled=disabled>{{selectedAsset}} <span class=caret></span></button><ul class=dropdown-menu uib-dropdown-menu role=menu aria-labelledby=single-button><li role=menuitem ng-repeat="assetType in assetTypes" ng-click=setAssetType(assetType)><a href=# ng-click=$event.preventDefault()>{{assetType}}</a></li></ul></div><div style="height: 55px"><label>Account Name</label><div class=invalid ng-messages=form.accountName.$error role=alert ng-show=form.$submitted><div ng-message=required>Required</div></div><input name=accountName type=text autocomplete=off ng-model=walletName ng-disabled=creating required focus><notification></notification></div></div></div></div><button class=button type=submit ng-click=addAccount() ng-disabled=creating><span>Add Account</span></button></form></div><div ng-hide=!creating class="content in-progress-overlay"><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Adding Account.</b></span><br>Please wait while your<br>account is added..</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div></div></div></section>'),
      e.put('app/popup/accountConfig/updateAccount.tpl.html', '<section id=add-account ng-controller=AccountConfigController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Edit Account Name</b></span> For Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><div class=help>Using accounts helps you organize balances on your device. Account names help you distinguish between accounts.</div><label>Account name</label><div class=invalid ng-messages=form.accountName.$error role=alert ng-show=form.$submitted><div ng-message=required>Required</div></div><input name=accountName type=text autocomplete=off ng-model=walletName ng-disabled=creating required focus></div></div></div><button class=button type=submit ng-click=updateAccountName() ng-disabled=creating>Update Account</button></form><notification></notification></div><div ng-hide=!creating class="content in-progress-overlay"><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Updating Account.</b></span><br>Please wait while your account information is updated..</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div></div></div></section>'),
      e.put('app/popup/buttonRequest/apply-policy.tpl.html', '<section id=button-request-apply-policy ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=apply-policy class=content ng-class="{\'enable-policy\': policyEnable, \'disable-policy\': !policyEnable}"><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>Confirm that you want to {{policyState}} the {{policyDescription}} policy on your <b><vendor-name after=.></vendor-name></b></span></h2><notification></notification><div class=policy-disclaimer><ng-include ng-if="policyName === \'shape_shift\' && policyEnable" src="\'app/popup/buttonRequest/shapeshift-terms-of-service.tpl.html\'"></ng-include></div></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/buttonRequest.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=generic class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>Please confirm this action by pressing and holding the button on your <b><vendor-name after=.></vendor-name></b></span></h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/changeLabel.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=change-label class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm that you want to change the label.</span></h2></div><notification></notification></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/changePin.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=pin-settings class=content ng-class="[buttonRequestType, device.pin_protection ? \'change-pin\' : \'add-pin\']"><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm that you want to {{device.pin_protection ? "change your PIN" : "add PIN protection"}}.</span></h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/changePinTimeout.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=generic class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm that you want to change the pin timeout.</span></h2></div><notification></notification></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/confirmOutput.tpl.html', '<section id=button-request ng-controller=SignTxController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=send-output class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm the amount and receiving address.</span> Carefully verify that the receiving address matches exactly payee\'s address.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/confirmTransferToAccount.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=transfer-output class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm the amount and destination account.</span> Carefully verify that the destination account and amount are correct.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/confirmWord.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=confirm-word class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm you have written down your recovery sentence.</span> This sentence serves as your device\'s backup. Secure it in a safe place.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/disablePassphrase.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=disable-passphrase class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm that you want to disable passphrase encryption.</span></h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/enablePassphrase.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=enable-passphrase class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm that you want to enable passphrase encryption.</span></h2><notification></notification></div></div><div class=content><p class="passphrase-note sending-alert">WARNING: forgetting your passphrase will lead to <b>loss of funds</b>. In case this occurs, ShapeShift will not be able to help you recover these assets. Be sure to keep your passphrase in a safe place.<br><br>For questions on usage of the BIP39 passphrase feature, please contact our support team: <a href=mailto:support@keepkey.com target=_blank>support@keepkey.com</a></p></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/feeOverThreshhold.tpl.html', '<section id=button-request ng-controller=SignTxController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=confirm-fee class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm the fee.</span> It appears to be unusually high. Make sure the details are accurate.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/firmwareErase.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header></header><div id=update-device class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm you have access to the backup of your recovery sentence.</span></h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/generic.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=generic class=content ng-class=[buttonRequestType]><h2><span class=cornflower-txt>Confirm this action on your <b><vendor-name></vendor-name></b></span></h2><notification></notification><div class=generic-button-message>Carefully read the message displayed on the screen of your <b><vendor-name></vendor-name></b> and confirm the change that you requested.</div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a><notification></notification></div></section>'),
      e.put('app/popup/buttonRequest/shapeshift-terms-of-service.tpl.html', '<div>By completing this action, you are agreeing to the <a href=https://info.shapeshift.io/sites/default/files/ShapeShift_Terms_Conditions%20v1.1.pdf target=_blank>ShapeShift.io Terms and Conditions of Use</a>.<notification></notification></div>'),
      e.put('app/popup/buttonRequest/sign-exchange.tpl.html', '<section id=button-request ng-controller=SignExchangeController><header><back-button class="button-left header-button" action=cancelExchangeRequest();></back-button></header><div id=confirm-exchange class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm the ShapeShift exchange summary.</span> Make sure the details are accurate.<ng-include src="\'app/popup/buttonRequest/shapeshift-terms-of-service.tpl.html\'"></ng-include></h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelExchangeRequest();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/signTx.tpl.html', '<section id=button-request ng-controller=SignTxController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=transaction class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm the transaction summary.</span> Make sure the details are accurate.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/buttonRequest/wipeDevice.tpl.html', '<section id=button-request ng-controller=ButtonRequestController><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div id=wipe-device class=content ng-class=buttonRequestType><div class=content-confirming-inner><div class=content-inner-centering><h2><span class=cornflower-txt>On your <b><vendor-name after=,></vendor-name></b> confirm you want to wipe your device.</span> This will remove all of its private keys and settings.</h2><notification></notification></div></div><a class="text-link-button cancel" ng-click=cancelDeviceOperation();>Cancel</a></div></section>'),
      e.put('app/popup/characterRequest/characterRequest.tpl.html', '<section id=character-request ng-controller=CharacterRequestController tabindex=0 focus ng-keydown=onKeyPress($event)><header><back-button class="button-left header-button" action=cancelDeviceOperation();goBack();></back-button></header><div class=content><h2><span class=cornflower-txt><b>Enter your recovery sentence</b></span></h2><div class="active-keys clearfix"><div class=legend-header>Available Keys</div><div class="key letter" ng-class=letterClasses uib-tooltip-template="\'app/popup/characterRequest/letterTooltip.tpl.html\'" tooltip-placement=bottom tooltip-append-to-body=true tooltip-class="key-help letters"><i class=fa ng-class=letterIcon></i> A - Z</div><div class="key space-bar" ng-class=spaceBarClasses uib-tooltip-template="\'app/popup/characterRequest/spaceTooltip.tpl.html\'" tooltip-placement=bottom tooltip-append-to-body=true tooltip-class="key-help space"><i class=fa ng-class=spaceBarIcon></i> Space</div><div class="key end-of-key" ng-class=enterClasses uib-tooltip-template="\'app/popup/characterRequest/enterTooltip.tpl.html\'" tooltip-placement=bottom tooltip-append-to-body=true tooltip-class="key-help enter"><i class=fa ng-class=enterIcon></i> Enter</div><div class="key backspace" ng-class=backspaceClasses uib-tooltip-template="\'app/popup/characterRequest/deleteTooltip.tpl.html\'" tooltip-placement=bottom tooltip-append-to-body=true tooltip-class="key-help delete"><i class=fa ng-class=backspaceIcon></i> Delete</div></div><div class="word-list clearfix"><div class=column ng-repeat="columnIndex in [0, 1, 2] track by columnIndex"><div ng-repeat="wordIndex in getColumnArray(wordCount, columnIndex) track by $index"><span class=checkmark-container><span ng-show=wordCompleted(wordIndex) class="fa fa-check"></span></span> <span class=word-index>{{wordIndex + 1}}.</span> <span class=word-representation ng-repeat="characterIndex in getEmptyArray(wordLength) track by $index">{{getCharAtCurrentPosition(wordIndex, $index)}}</span></div></div></div><div class=more-words-message ng-show=moreWordsAvailable>Type a space to enter more words</div><button class=button disabled ng-disabled=enterClasses.disabled ng-click=send()>Done</button><notification></notification></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer><div class=overlay ng-show=sendInProgress></div></section>'),
      e.put('app/popup/characterRequest/deleteTooltip.tpl.html', '<div>Use the <b>&lt;delete&gt;</b> or <b>&lt;backspace&gt;</b> key to make corrections to what you have typed.</div>'),
      e.put('app/popup/characterRequest/enterTooltip.tpl.html', '<div>Use the <b>&lt;enter&gt;</b> key to submit your mnemonic key after you type the last letter of the last word. The <b>&lt;enter&gt;</b> key is only active on the 12th, 18th and 24th words and only after 3 or 4 characters are typed.</div>'),
      e.put('app/popup/characterRequest/letterTooltip.tpl.html', '<div>The only characters that are valid in a mnemonic key are alphabetic characters. The first four characters of every valid mnemonic word are unique, so this screen will only let you type up to four characters per word.</div>'),
      e.put('app/popup/characterRequest/spaceTooltip.tpl.html', '<div>The <b>&lt;space&gt;</b> character is used to move to the next word. It is only enabled after 3 or 4 characters have been entered for a word. NOTE: If your key is longer than 12 words, when you type a <b>&lt;space&gt;</b> after the 12th word, space for additional words will be displayed.</div>'),
      e.put('app/popup/confirm-exchange/confirm-exchange.tpl.html', '<div id=confirm-exchange ng-controller=ConfirmExchangeController><header><back-button class="button-left header-button" action=cancelExchangeRequest()></back-button></header><div class=content><h2><span class=cornflower-txt>Approve Conversion</span></h2><div class=content-inner><div class=content-inner-centering><div class=help>Convert<formatted-amount amount=depositAmount currency=depositCurrency></formatted-amount>to<formatted-amount amount=withdrawalAmount currency=withdrawalCurrency></formatted-amount>and send to your {{withdrawalCurrencyName}} account named "{{withdrawalAccountName}}".<ng-include src="\'app/popup/buttonRequest/shapeshift-terms-of-service.tpl.html\'"></ng-include></div></div></div></div><button class=button type=submit ng-click=nextAction()>Approve</button><notification></notification><a class="text-link-button cancel" ng-click=cancelExchangeRequest();>Cancel</a></div>'),
      e.put('app/popup/connect/connect.tpl.html', '<div id=connect ng-controller=ConnectController><header></header><div class=content><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt>No <b>KeepKey</b> detected.</span><br>To begin, plug in your KeepKey.</h2><div id=device></div></div></div><p class="connect-note alert-info sending-alert" ng-if=showMessage>If your KeepKey is plugged in and not being detected, check the display of your device for further instructions.<br><br>If your KeepKey is unresponsive, <b><a ng-click=launchSupportTab()>contact support</a></b>.</p></div><footer></footer></div>'),
      e.put('app/popup/creating/creating.tpl.html', '<section id=creating><header><back-button class="button-left header-button" destination="\'/walletlist\'"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Creating Bitcoin Wallet.</b></span><br>Confirm creation on KeepKey.</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/device/device.tpl.html', '<section id=device-settings ng-controller=DeviceController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Settings</b></span> For Your<vendor-name></vendor-name></h2><div class=menu><ul><li><button class=menu-item ng-click="go(\'/label/settings\', \'slideLeft\')">Change Label</button></li><li ng-hide=!supportsRecoveryDryRun><button class=menu-item ng-click=recoveryDryRun()>Test Recovery Sentence</button></li><li><button class=menu-item ng-click=changePin()>{{device.pin_protection ? "Change PIN" : "Add PIN Protection"}}</button></li><li><button class=menu-item ng-click="go(\'/pin-timeout\', \'slideLeft\')">Change Pin Timeout</button></li><li><button class=menu-item ng-click=togglePassphrase(device)>{{device.passphrase_protection ? "Disable BIP39 Passphrase" : "Enable BIP39 Passphrase"}}</button></li><li><button class=menu-item ng-click=wipeDevice()>Wipe Device</button></li><li><button class=menu-item ng-click="go(\'/support\', \'slideLeft\')">Contact Support</button></li><li><button class=menu-item ng-click="go(\'/about\', \'slideLeft\')">About KeepKey</button></li><li><button class=menu-item ng-click="go(\'/acknowledgements\', \'slideLeft\')">Acknowledgements</button></li><li ng-show=showLoginButton><button class=menu-item ng-click=loginToSS()>Log in to ShapeShift</button></li><li ng-show=!showLoginButton><button class=menu-item ng-click=logoutFromSS()>Log out from Shapeshift</button></li></ul><notification></notification></div></div><div class=footer><div class=left><vendor-name></vendor-name>Firmware <span class=data>v{{device.major_version}}.{{device.minor_version}}.{{device.patch_version}}</span></div><div class=right>KeepKey Client v{{device.wallet_version}}</div></div><notification-message></notification-message></section>'),
      e.put('app/popup/device/lifeboat.tpl.html', '<section id=device-settings ng-controller=LifeboatController><header><back-button class="button-left header-button" action=goToTop()></back-button></header><div class=content><h2><span class=cornflower-txt><b>Settings</b></span> For Your<vendor-name></vendor-name></h2><div class=menu><ul><li><button class=menu-item ng-click=wipeDevice()>Wipe Device</button></li><li><button class=menu-item ng-click="go(\'/pin-timeout\', \'slideLeft\')">Change Pin Timeout</button></li><li><button class=menu-item ng-click="go(\'/support\', \'slideLeft\')">Contact Support</button></li><li><button class=menu-item ng-click="go(\'/about\', \'slideLeft\')">About KeepKey</button></li></ul></div><notification></notification></div><div class=footer><div class=left><vendor-name></vendor-name>Firmware <span class=data>v{{device.major_version}}.{{device.minor_version}}.{{device.patch_version}}</span></div><div class=right>KeepKey Client v{{device.wallet_version}}</div></div><notification-message></notification-message></section>'),
      e.put('app/popup/disable-conflicting/conflicting-message.tpl.html', '<section id=conflicting-application-screen><header></header><div class="content failure"><div class=content-inner><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span> <span class=alert-text>Conflicting Application</span></div><div class=alert-description>There is another application running that conflicts with the KeepKey Client. Please close the KeepKey Client and any other applications which use your<vendor-name after=.></vendor-name>Unplug and reconnect your<vendor-name after=,></vendor-name>then reopen the KeepKey Client.</div></div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/exchange/exchange.tpl.html', '<section id=build-transaction ng-controller=ExchangeController><header><back-button class="button-left header-button"></back-button></header><div class=content><account-balance account=sourceAccount loading=false fresh=fresh currency=currency name-display=name ng-if=sourceAccount.name></account-balance><form name=form novalidate ng-class="{exchange: true}"><source-entry field-name=source source-account=sourceAccount source-account-image-url=sourceAccountImageUrl ng-hide=sourceAccount.name></source-entry><exchange-setup-recipient-entry ng-show=sourceAccount.name ng-hide="!sourceAccount.name || destinationAccount.name" current-account=sourceAccount.id destination-account=destinationAccount destination-account-image-url=destinationAccountImageUrl field-name=dest form=form currency-name={{sourceAccount.coinType}} disabled=preparingTransaction></exchange-setup-recipient-entry><div class=exchange-setup><div class=exchange-images ng-class="{\'image-centered\': true}"><div ng-show=sourceAccount.name><img class=currency-logo ng-src={{sourceAccountImageUrl}}><div class=centered>{{sourceAccount.coinType}}</div></div><i class="fa fa-arrow-right" ng-if=destinationAccount.name></i><div class=shapeshift-exchange-container ng-if=destinationAccount.name><div class=shapeshift-fox-container><img class=fox src=assets/partner-logos/shapeshift.svg></div></div><i class="fa fa-arrow-right" ng-if=destinationAccount.name></i><div ng-if=destinationAccount.name><img class=currency-logo ng-src={{destinationAccountImageUrl}}><div class=centered>{{destinationAccount.coinType}}</div></div></div></div><div class="content-inner-centering sending two-column"><div class=amount-container><amount-entry amount=userInput.amount max-amount=maxSendAmount.toString() min-amount=minSendAmount.toString() max-reason=maxReason min-reason=minReason field-name=amount form=form disable=preparingTransaction currency=currency is-exchange-amount-label=false loading=!fresh.status ng-if=destinationAccount.name></amount-entry></div><div class=value-container ng-show=destinationAccount.name><div class=value-display><label>Estimated receive amount:</label><div class="estimated-value value"><formatted-amount ng-show=estimatedReceiveAmount amount=estimatedReceiveAmount currency=destinationCurrency></formatted-amount>&nbsp;</div></div></div></div><div class=fee-container ng-class="{\'two-column\': destinationAccount.name}" ng-show=destinationAccount.name><div class=value-container><div class="fee-display value-display"><label>Miner fee:</label><div class=value><formatted-amount class=fee ng-show=showFee() amount=getFee(userInput.feeLevel) currency=getFeeCurrency()></formatted-amount></div></div></div><div class=value-container ng-show=destinationAccount.name><div class="exchange-rate-display value-display"><label>Estimated rate:</label><div class=value><span>1&nbsp;{{currencySymbol}}&nbsp;&asymp;&nbsp;</span><formatted-amount amount=exchangeMarketInfo.rate currency=destinationCurrency></formatted-amount></div></div></div></div><div class=bch-fork-container ng-show=bchOnly><div class=bch-info-container><img class=bch-warning src=assets/img/warning-icon.png><div class=bch-fork-text>Due to the Bitcoin Cash fork, there is a risk of replay attacks on BCH transactions after 15 November 2020, 12:00 PM GMT (epoch 1605441600). This wallet will follow the BCHN chain. Learn more <a href=https://bchinfo.org/en/alert/2020-08-09-nov-upgrade target=_blank>here.</a></div></div><div class=bch-checkbox-container><input type=checkbox ng-model=enableBchButton> I understand and accept the risks.</div></div><div class="alert-info sending-alert" ng-show=exchangeDenied()><span ng-if="exchangeStatus.errorCode === \'geoRestriction\'">ShapeShift is not available in your area. Please see <a href={{exchangeStatus.url}} target=_blank>{{exchangeStatus.url}}</a> for more information.</span></div><div class=login-prompt><span ng-show=showLogin>Please log in to your ShapeShift account from the settings page in order to get the full benefits of FOX membership!</span> <button class=button type=submit ng-disabled="disableTradeButton || !enableBchButton" ng-click=buildTransaction()>Start Trade</button></div></form></div><ng-include src="\'app/popup/send/preparing.tpl.html\'" ng-if=preparingTransaction></ng-include></section>'),
      e.put('app/popup/directives/AccountBalanceComponent.tpl.html', '<div class="account-balance-component online"><div ng-show=fresh.status class=connection-light></div><div ng-hide=fresh.status class=refreshing-balance><i class="fa fa-refresh fa-spin" aria-hidden=true></i></div><img ng-src={{accountImageUrl}}><wallet-balance class=details balance=account.highConfidenceBalance pending=account.lowConfidenceBalance loading=loading currency=currency></wallet-balance><div class=account-number ng-hide=singleAccount>{{name}} <button ng-if=canEdit() class="fa fa-pencil" ng-click=accountSettings() uib-tooltip="Change Account Name" tooltip-placement=bottom-right tooltip-popup-delay=500></button></div></div>'),
      e.put('app/popup/directives/AmountEntry.tpl.html', '<div class=amount-entry><label>{{amountLabel}}</label><div class=input-field><span class=exchange-currency ng-show=isExchangeAmountLabel>{{symbol}}</span> <input ng-keypress=fillMaxDetector($event) name={{fieldName}} ng-model=amount , ng-focus="focusedElement = \'amount\'" ; ng-disabled="disabled || maxLessThanMin" bignumber-min={{bigMinAmount.toString()}} bignumber-max={{bigMaxAmount.toString()}} maxlength=30 currency={{currency}} autocomplete=off required><div ng-hide=loading tooltip-append-to-body=true class="max-value-button fa fa-arrow-up" ng-click=fillMax() uib-tooltip="Send maximum"></div></div><div class=invalid ng-messages=field.$error role=alert ng-show=form.$submitted><div ng-message=required>Required</div><div ng-message=max>{{maxReason}}: {{formattedMax.toString()}} {{symbol}}</div><div ng-message=min>{{minReason}}: {{formattedMin.toString()}} {{symbol}}</div><div ng-message=number>Invalid Amount</div></div></div>'),
      e.put('app/popup/directives/ExchangeSetupRecipientEntry.tpl.html', '<div class=exchange-setup-recipient-entry><label>{{labelVariation}}</label> <input type=text name={{fieldName}} autocomplete=off autocorrect=off autocapitalize=off spellcheck=false ng-model=selected ng-pattern=pattern ng-focus="focusedElement = \'dest\'" placeholder={{placeholder}} uib-typeahead="account as account.name for account in accounts | filter:{name:$viewValue}" typeahead-template-url=customTemplate.html typeahead-on-select="ignoreClick($item, $model, $label, $event)" class="form-control recipient-input" typeahead-show-hint=true typeahead-min-length=0 required></div>'),
      e.put('app/popup/directives/FeeSelector.tpl.html', '<div class=fee-selector><label>Fee Level:</label><br><div class="fee-level-btn btn-group" role=group uib-dropdown is-open=dropdownIsOpen><button id={buttonId}} type=button class="btn btn-fee-dropdown fee-level-btn" uib-dropdown-toggle ng-disabled=disabled><span class=feeName>{{formatName(selected)}}</span> <span class=caret></span></button><ul uib-dropdown-menu role=menu aria-labelledby={{buttonId}} class="dropdown-menu fee-level-menu"><li ng-repeat="feeLevel in feeLevels" role=menuitem><a ng-click=select(feeLevel)><span class=feeName>{{formatName(feeLevel)}}</span></a></li></ul></div></div>'),
      e.put('app/popup/directives/Notification.tpl.html', '<div ng-if=messages class=notification-alert><span><span class="fa fa-exclamation-triangle"></span> <span class=alert-text ng-bind-html=messages></span></span></div>'),
      e.put('app/popup/directives/RecipientEntry.tpl.html', '<div class=recipient-entry><script type=text/ng-template id=customTemplate.html><div class="overlay" ng-if="!match.model.isAvailable"> Exchange not available </div> <a class="entry"> <img ng-src="assets/currency-logos/{{ match.model.coinType | lowercase }}.png"/> {{match.model.coinType}} (<span ng-bind-html="match.label | uibTypeaheadHighlight:query"></span>) </a></script><label>{{labelVariation}}</label> <input type=text name={{fieldName}} autocomplete=off autocorrect=off autocapitalize=off spellcheck=false ng-model=selected ng-pattern=pattern ng-focus="focusedElement = \'dest\'" placeholder={{placeholder}} uib-typeahead="account as account.name for account in accounts | filter:{name:$viewValue}" typeahead-template-url=customTemplate.html typeahead-on-select="ignoreClick($item, $model, $label, $event)" class="form-control recipient-input" typeahead-show-hint=true typeahead-min-length=0 required><div class=invalid-recipient ng-messages=field.$error role=alert ng-show="form.$submitted || field.$error.exchangeAvailability"><div ng-message=required>Required</div><div ng-message=pattern>Invalid address / unknown account</div><div ng-message=exchangeAvailability>Exchange is not available to this coin</div></div></div>'),
      e.put('app/popup/directives/SourceEntry.tpl.html', '<div class=source-entry><script type=text/ng-template id=sourceTemplate.html><a class="entry"> <img ng-src="assets/currency-logos/{{ match.model.coinType | lowercase }}.png"/> {{match.model.coinType}} (<span ng-bind-html="match.label | uibTypeaheadHighlight:query"></span>) </a></script><div class=title>Trade</div><label>{{label}}</label> <input type=text name={{fieldName}} ng-model=selectedSourceAccount uib-typeahead="account as account.name for account in accounts | filter:{name:$viewValue}" typeahead-template-url=sourceTemplate.html placeholder="Select one of your accounts...." class=form-control ng-pattern=accountPattern typeahead-show-hint=true typeahead-min-length=0 style=font-size:14px required><div class=invalid-recipient ng-messages=field.$error role=alert ng-show=form.$submitted><div ng-message=required>Required</div><div ng-message=pattern>Unknown Account</div></div></div>'),
      e.put('app/popup/directives/WalletSelectorDropdown.tpl.html', '<div class="wallet-selector-dropdown clearfix"><label>{{label}}</label><div class=btn-group uib-dropdown is-open=dropdownIsOpen><button id={{buttonId}} type=button class="btn btn-primary" uib-dropdown-toggle ng-disabled=disabled>{{selected.name}} <span class=caret></span></button><ul uib-dropdown-menu role=menu aria-labelledby={{buttonId}}><li ng-repeat="account in accountList | orderBy : \'accountNumber\' track by account.id" role=menuitem><a ng-click=select(account)>{{account.name}}</a></li></ul></div></div>'),
      e.put('app/popup/directives/notificationMessage.tpl.html', '<div class="content notification" ng-hide=!showMessage><div class=content-inner><div class=description><div class=alert-icon><span class="fa fa-check-square"></span></div><p>{{message}}</p></div></div></div>'),
      e.put('app/popup/directives/pinPad.tpl.html', '<div class=noselect><div class=content-pin-inner><div class=content-inner-centering><div class=help>Use PIN layout shown on<vendor-name></vendor-name>to find the location to press on this PIN pad.</div><div class=pin-pad><div class=pin-row><a class="button pin" ng-click=appendToPin(7)>\u2022</a> <a class="button pin" ng-click=appendToPin(8)>\u2022</a> <a class="button pin" ng-click=appendToPin(9)>\u2022</a></div><div class=pin-row><a class="button pin" ng-click=appendToPin(4)>\u2022</a> <a class="button pin" ng-click=appendToPin(5)>\u2022</a> <a class="button pin" ng-click=appendToPin(6)>\u2022</a></div><div class=pin-row><a class="button pin" ng-click=appendToPin(1)>\u2022</a> <a class="button pin" ng-click=appendToPin(2)>\u2022</a> <a class="button pin" ng-click=appendToPin(3)>\u2022</a></div><div class=pin-display-container><div class=pin-view ng-bind=displayPin></div><i class="backspace fa fa-arrow-left" ng-click=backspace() ng-show=displayPin.length></i></div></div></div></div><a class=button ng-disabled=!displayPin.length ng-click=sendPin()><span ng-bind=buttonText></span></a></div>'),
      e.put('app/popup/directives/walletBalance.tpl.html', '<div class=wallet-balance ng-class="{\'has-pending-balance\': pending}"><div class=balance><span ng-show=loading><span class="fa fa-refresh fa-spin"></span></span><formatted-amount ng-hide=loading amount=balance currency=currency></formatted-amount><exchange-formatted-amount ng-hide=loading amount=balance currency=currency></exchange-formatted-amount></div><div class=unconfirmed-balance ng-show=showPending><span>Pending:&nbsp;</span><formatted-amount signed=true amount=pending currency=currency></formatted-amount></div></div>'),
      e.put('app/popup/failure/Bip44AccountGapViolation.tpl.html', '<section id=bip44-account-gap-violation ng-controller=Bip44AccountGapViolationController><header><back-button class="button-left header-button"></back-button></header><div class="content failure"><div class=content-inner><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><p>A new account can\'t be created when the previous account doesn\'t have any transactions associated with it. Before you can create a new account, you need to send funds to the account named <span class=previous-account-name>{{previousAccountName}}</span>.</p><p>More details are available in the <a target=_blank href=https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#account>BIP44</a> specification.</p><notification></notification></div><div class=technical-description>BIP44 Account Gap Violation</div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/MustHaveAtLeastOneInput.tpl.html', '<section id=failure ng-controller=FailureController><header></header><div class="content failure"><div class=content-inner-with-button><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><div class="failure-list ng-scope" ng-repeat="failure in failures"><p>The transaction you are trying to send doesn\'t have any inputs. This usually happens when you send an amount that doesn\'t leave enough to pay the miners\' fees. Try sending a lower amount.</p><notification></notification></div></div></div><a class=button ng-click=ok()>OK</a></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/UnableToInitialize.tpl.html', '<section id=unable-to-initialize ng-controller=FailureController><header></header><div class="content failure"><div class=content-inner><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><p>Not able to Initialize your<vendor-name after=.></vendor-name>Check the device screen for instructions or try disconnecting and reconnecting it.</p><notification></notification></div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/failure.tpl.html', '<section id=failure ng-controller=FailureController><header></header><div class="content failure"><div class=content-inner-with-button><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><div class="failure-list ng-scope" ng-repeat="failure in failures"><p>{{failure}}</p><notification></notification></div></div></div><a class=button ng-click=ok()>OK</a></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/firmwareEraseCancelled.tpl.html', '<section id=firmware-erase-cancelled ng-controller=FailureController><header></header><div class="content failure"><div class=content-inner><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><p>Firmware erase cancelled. Disconnect and reconnect to reboot your<vendor-name after=.></vendor-name></p><notification></notification></div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/pinConfirmationFailed.tpl.html', '<section id=pin-confirmation-failed ng-controller=FailureController ng-hide=hidden><header><back-button class="button-left header-button" action=ok()></back-button></header><div class="content failure"><div class=content-inner-with-button><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><p>Your PIN choice failed. The PINs you entered did not match each other. Please start over.</p><notification></notification></div></div><a class=button ng-click=ok()>Start Over</a></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/failure/pinInvalid.tpl.html', '<section id=pin-confirmation-failed ng-controller=FailureController ng-hide=hidden><header><back-button ng-hide=showDeviceConfigurationButton class="button-left header-button" action=cancelPinRequest();></back-button><settings-button ng-show=showDeviceConfigurationButton class="button-left header-button" action=cancelDeviceOperation(); route="\'/lifeboat\'"></settings-button></header><div class="content failure"><div class=content-inner-with-button><div class=description><div class=alert-icon><span class="fa fa-exclamation-triangle"></span></div><p>The PIN you entered was incorrect. Please try entering your PIN again.</p><notification></notification></div></div><a class=button ng-click=ok()>Try Again</a></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/footer/footer.tpl.html', '<div ng-controller=FooterController>Connected: <span class=data><span ng-show=device.initialized ng-bind=device.label></span> <span ng-show=!device.initialized>Uninitialized</span></span> Software: <span class=data>v{{version}}</span> Firmware: <span class=data>v{{device.major_version}}.{{device.minor_version}}.{{device.patch_version}}</span></div>'),
      e.put('app/popup/initialize/initialize.tpl.html', '<section id=initialize ng-controller=InitializationController><div class=content><div class=content-inner><div class=content-inner-centering><h2><span class=cornflower-txt>Your <b><vendor-name></vendor-name></b> needs to be initialized.</span> Before you can use this<vendor-name after=,></vendor-name>it must be initialized. During this step, your private keys are generated.</h2><a class=button ng-click="go(\'/selectWordCount/label\', \'slideLeft\')">Initialize <b><vendor-name></vendor-name></b></a><a class=button ng-click="go(\'/label/recover\', \'slideLeft\')">Recover <b><vendor-name></vendor-name></b></a></div></div><a class=text-link-button ng-click="go(\'/about\', \'slideLeft\')">About <vendor-name></vendor-name></a></div><notification></notification><notification-message></notification-message></section>'),
      e.put('app/popup/selectWordCount/selectWordCount.tpl.html', '<section id=select-word-count ng-controller=ResetController><header><back-button class="button-left header-button" destination="\'/initialize\'"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Seed Phrase Entropy</b></span> For Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><div class=help>Random 12, 18, or 24-word recovery sentence that’s used to derive numerous pairs of private and public keys.</div><label>Select Seed Phrase Length</label><br><div class=btn-group uib-dropdown><button type=button uib-dropdown-toggle ng-disabled=disabled>{{makeSeedDescription(resetRecoverData.word_count)}} <span class=caret></span></button><ul class=dropdown-menu uib-dropdown-menu role=menu aria-labelledby=single-button><li role=menuitem ng-repeat="word_count in validSeedLength" ng-click=setSeedLength(word_count)><a href=# ng-click=$event.preventDefault()>{{makeSeedDescription(word_count)}}</a></li></ul></div></div></div></div><div class="content-form-inner bip39select"><input type="checkbox" id="bip39checkbox" ng-model=resetRecoverData.passphrase_protection><label for="bip39checkbox">Enable BIP39 Passphrase</label></div><button class=button type=submit ng-click=nextAction()>Select Word Count</button></form><notification></notification></div></section>'),
      e.put('app/popup/label/label.tpl.html', '<section id=label ng-controller=ResetController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>{{changeLabel ? \'Change Label\' : \'Choose a Label\'}}</b></span> For Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><div class=help>A label allows you to distinguish your<vendor-name></vendor-name>from others that you may own.</div><label>Label</label><div class=invalid ng-show=form.$submitted><div ng-show=form.deviceLabel.$error.required>Required</div></div><input name=deviceLabel type=text autocomplete=off ng-model=resetRecoverData.label required focus></div></div></div><button class=button type=submit ng-click=nextAction()>Set Label</button></form><notification></notification></div></section>'),
      e.put('app/popup/passphrase/passphrase.tpl.html', '<section id=passphrase ng-controller=PassphraseController><header></header><div class=content><h2><span class=cornflower-txt><b>Enter the Passphrase</b></span> For Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><label for=passphrase>Passphrase:</label> <input name=passphrase type=password autocomplete=off focus ng-model=userInput.passphrase> <label for=confirmPassphrase>Confirm passphrase:</label><div class=invalid ng-show=form.$submitted><div ng-show=form.confirmPassphrase.$error.compareTo>Must Match</div></div><input name=confirmPassphrase id=confirmPassphrase type=password ng-model=userInput.confirmPassphrase compare-to=userInput.passphrase autocomplete=off></div></div></div><button class=button type=submit ng-click=sendPassphrase()>Send Passphrase</button></form><notification></notification></div></section>'),
      e.put('app/popup/pin/confirmPin.tpl.html', '<section id=pin ng-controller=PinController tabindex="0" focus ng-keydown=onKeyPress($event)><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div class=content><div><h2><span class=cornflower-txt><b>Re-enter the PIN</b></span> For Your<vendor-name></vendor-name></h2></div><pin-pad button-text="Confirm PIN"></pin-pad><notification></notification></div></section>'),
      e.put('app/popup/pin/newPin.tpl.html', '<section id=pin ng-controller=PinController tabindex="0" focus ng-keydown=onKeyPress($event)><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div class=content><h2><span class=cornflower-txt><b>Choose a PIN</b></span> For Your<vendor-name></vendor-name></h2><pin-pad button-text="Choose PIN"></pin-pad><notification></notification></div></section>'),
      e.put('app/popup/pin/pin.tpl.html', '<section id=pin ng-controller=PinController tabindex="0" focus ng-keydown=onKeyPress($event)><header><back-button ng-hide=showDeviceConfigurationButton class="button-left header-button" action=cancelDeviceOperation();></back-button><settings-button ng-show=showDeviceConfigurationButton class="button-left header-button" action=cancelDeviceOperation(); route="\'/lifeboat\'"></settings-button></header><div class=content><div><h2><span class=cornflower-txt><b>Enter the PIN</b></span> For Your<vendor-name></vendor-name></h2></div><pin-pad button-text="Send PIN" success-route={{successRoute}}></pin-pad><notification></notification></div></section>'),
      e.put('app/popup/pin-timeout/pin-timeout.tpl.html', '<section id=label ng-controller=PinTimeoutController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>{{\'Change Pin Timeout\'}}</b></span> For Your<vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><div class=content-form-inner><div class=content-inner-centering><div class=help>Change how long your device will wait before it requires you to enter your pin again.</div><label>Pin Timeout (in minutes)</label><div class=invalid ng-show=form.$submitted><div ng-show=form.deviceLabel.$error.required>Required</div></div><form name=form><input name=input type=number autocomplete=off ng-model=timeout required min=2 max=120 focus><div role=alert><span class=form-error ng-show=form.input.$error.required>Required!</span> <span class=form-error ng-show=form.input.$error.number>Not valid number!</span> <span class=form-error ng-show=form.input.$error.min>Below minimum!</span> <span class=form-error ng-show=form.input.$error.max>Above maximum!</span></div></form></div></div></div><button class=button type=submit ng-click=nextAction()>Set Pin Timeout</button></form><notification></notification></div></section>'),
      e.put('app/popup/preparing/preparing.tpl.html', '<section id=preparing ng-controller=PreparingController><header><back-button class="button-left header-button"></back-button></header><div class=content><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Preparing Transaction.</b></span><br>Please wait while your<br>transaction is prepared...</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div><div class=progress-indicator ng-show=progress.total>{{ progress.current }} of {{ progress.total }}</div></div></div></div></section>'),
      e.put('app/popup/prerelease-device/prerelease-device.tpl.html', '<section id=prerelease-device ng-controller=SupportController><div class=content><h2><p style="font-size: 18px">Device Error</p><p>An error was detected on your device. Please <a target=_blank href=https://support.keepkey.com/support/tickets/new>contact support</a>. (Code: KH-00)</p></h2><div class=menu><ul><li><button class=menu-item ng-click=launchSupportTab()>Web</button></li><li><button class=menu-item ng-click=openEmail()>Email {{supportEmailAddress}}</button></li></ul></div><div class=menu-annotation>Telephone: {{supportPhoneNumber}}</div></div></section>'),
      e.put('app/popup/receive/receive.tpl.html', '<section id=receive ng-controller=ReceiveController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Receive</b></span> {{currency}}</h2><div class=content-inner><div class=content-inner-centering><div class=help>Confirm the address below is the same one shown on your<vendor-name></vendor-name>before using it.</div><qrcode ng-show=unusedAddress.address class=qrcode data={{unusedAddress.address}} size=160 error-correction-level=L target=_blank></qrcode><div ng-show=unusedAddress.address><span class=bitcoin-receive-link>{{unusedAddress.address.replace("bitcoincash:","")}}</span> <button class="copy-to-clipboard-button fa fa-clipboard" data-clipboard-text={{unusedAddress.address}}></button><notification></notification></div><div class=node-path>{{unusedAddress.nodePath}}</div></div><div class="address-nav prev fa fa-chevron-left" ng-hide=isSingleAddressAccount ng-class="{disabled: addressDepth <= 0}" ng-click="showAnotherAddress(addressDepth - 1)"></div><div class="address-nav next fa fa-chevron-right" ng-hide=isSingleAddressAccount ng-class="{disabled: addressDepth >= maxDepth}" ng-click="showAnotherAddress(addressDepth + 1)"></div></div></div><div class="content in-progress-overlay" ng-hide=unusedAddress.address><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Finding unused address.</b></span><br>Please wait while we<br>find an unused address...</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div></div></div></section>'),
      e.put('app/popup/send/preparing.tpl.html', '<div class="content in-progress-overlay"><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Preparing Transaction.</b></span><br>Please wait while your<br>transaction is prepared...</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div><div class=progress-indicator ng-show=progress.total>{{ progress.current }} of {{ progress.total }}</div></div></div></div>'),
      e.put('app/popup/send/send.tpl.html', '<section id=build-transaction ng-controller=SendController><header><back-button class="button-left header-button"></back-button></header><div class=content><div ng-show=showForm><account-balance account=wallet single-account=singleAccount loading=false name-display=name currency=currency fresh=fresh></account-balance><form name=form novalidate ng-class="{exchange: isExchange}"><div class=form-input-container><div class="content-form-inner sending"><div class=content-header><recipient-entry recipient=userInput.address field-name=dest form=form currency-name={{currency}} current-account=wallet.id disabled=preparingTransaction filter-recipient-for-exchange=false></recipient-entry></div><div class=exchange-images ng-class="{\'image-centered\': !userInput.address}"><div><img class=currency-logo ng-src={{accountCurrencyUrl}}><div class=centered>{{currencySymbol}}</div></div><i class="fa fa-arrow-right" ng-if="isExchange || userInput.address"></i><div class=shapeshift-exchange-container ng-if=isExchange><div class=shapeshift-fox-container><img class=fox src=assets/partner-logos/shapeshift.svg></div></div><i class="fa fa-arrow-right" ng-if=isExchange></i><div ng-if=destinationCurrency><img class=currency-logo ng-src={{destinationCurrencyUrl}}><div class=centered>{{destinationCurrencySymbol}}</div></div><div ng-if="userInput.address && !destinationCurrency"><img class=currency-logo ng-src={{accountCurrencyUrl}}><div class=centered>external address</div></div></div><div class="content-inner-centering sending" ng-class="{\'two-column\': isExchange}"><div class=amount-container><amount-entry amount=userInput.amount max-amount=maxSendAmount.toString() min-amount=minSendAmount.toString() max-reason=maxReason min-reason=minReason field-name=amount form=form disable=preparingTransaction currency=currency is-exchange-amount-label=false loading=!fresh.status></amount-entry><fee-selector ng-show="config.showFeeSelector && !isExchange && feeLevels.length > 1" fee-levels=feeLevels estimated-fees=estimatedFee.fee selected=userInput.feeLevel active="!preparingTransaction && userInput.amount > 0"></fee-selector></div><div class=value-container ng-show=isExchange><div class=value-display><label>Estimated receive amount:</label><div class="estimated-value value"><formatted-amount ng-show=estimatedReceiveAmount amount=estimatedReceiveAmount currency=destinationCurrency></formatted-amount>&nbsp;</div></div></div></div></div></div><div class=fee-container ng-class="{\'two-column\': isExchange}"><div class=value-container><div class="fee-display value-display"><label>Miner fee:</label><div class=value><formatted-amount class=fee ng-show=showFee() amount=getFee(userInput.feeLevel) currency=getFeeCurrency()></formatted-amount></div></div></div><div class=value-container ng-show=isExchange><div class="exchange-rate-display value-display"><label>Estimated rate:</label><div class=value><span>1&nbsp;{{currencySymbol}}&nbsp;&asymp;&nbsp;</span><formatted-amount amount=exchangeMarketInfo.rate currency=destinationCurrency></formatted-amount></div></div></div></div><div class="alert-info sending-alert" ng-show=exchangeDenied()><span ng-if="exchangeStatus.errorCode === \'geoRestriction\'">ShapeShift is not available in your area. Please see <a href={{exchangeStatus.url}} target=_blank>{{exchangeStatus.url}}</a> for more information.</span></div><button class=button type=submit ng-show="!showLogin || !isExchange" ng-disabled="preparingTransaction || !enableExchangeButton" ng-click=buildTransaction()>{{buttonText}}</button><div ng-show="showLogin && isExchange" class=login-prompt><span>You must log in to your ShapeShift Account in order to trade assets.</span> <button class=button ng-click=loginToSS()>Log in to ShapeShift</button></div></form><notification></notification></div><div ng-hide=showForm>Can\'t send from an account with a high confidence balance of 0</div></div><ng-include src="\'app/popup/send/preparing.tpl.html\'" ng-if=preparingTransaction></ng-include></section>'),
      e.put('app/popup/sending/sending.tpl.html', '<section id=sending><header><back-button class="button-left header-button" action=cancelDeviceOperation();></back-button></header><div class=content><h2><span class=cornflower-txt><b>Signing Transaction</b></span><br>follow the prompts on your<vendor-name after=...></vendor-name></h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div><a class=button ng-click=cancelDeviceOperation();>Cancel</a><notification></notification></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/success/buildingTransaction.tpl.html', '<section id=success ng-controller=SuccessController><header></header><div class=content><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Signing transaction.</b></span><br>Please wait while your<vendor-name></vendor-name>signs the transaction.</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div><notification></notification></div></div></div></div></section>'),
      e.put('app/popup/xpub/xpub.tpl.html', '<section id=xpub ng-controller=ViewXPubController><header><back-button class="button-left header-button"></back-button></header><div class=content><h2>{{currency}} <span class=cornflower-txt><b>XPub Address</b></span></h2><div class=content-inner><div class=content-inner-centering><div class=help>Confirm the address below is the same one shown on your<vendor-name></vendor-name>before using it.</div><qrcode ng-show=unusedAddress.address class=qrcode data={{unusedAddress.address}} size=160 version=7 error-correction-level=M target=_blank></qrcode><div class=address ng-show=unusedAddress.address><span class=bitcoin-receive-link>{{unusedAddress.address}}</span> <button class="copy-to-clipboard-button fa fa-clipboard" data-clipboard-text={{unusedAddress.address}}></button><notification></notification></div><div class=node-path>{{unusedAddress.nodePath}}</div></div></div></div><div class="content in-progress-overlay" ng-hide=unusedAddress.address><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Finding unused address.</b></span><br>Please wait while we<br>find an unused address...</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div></div></div></section>'),
      e.put('app/popup/success/success.tpl.html', '<section id=success ng-controller=SuccessController><header></header><div class=content><h2><span class=cornflower-txt>Success!</span></h2><div>Your action was acknowleged by your <b><vendor-name after=.></vendor-name></b></div><div>{{message}}</div><notification></notification></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/success/updatingFirmware.tpl.html', '<section id=success ng-controller=SuccessController><div class=content><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Updating firmware.</b></span><br>Please wait while your<vendor-name after="\'s"></vendor-name>firmware is updated. Do not unplug the device.</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div><notification></notification></div></div></div></div></section>'),
      e.put('app/popup/success/uploadComplete.tpl.html', '<section id=success ng-controller=SuccessController><header></header><div class="content success-upload-complete"><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Firmware update complete.</b></span><br>Please disconnect and reconnect your device, as well as close and reopen the KeepKey Client.</h2><div class=success></div><notification></notification></div></div></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/support/support.tpl.html', '<section id=support ng-controller=SupportController><header><back-button class="button-left header-button" destination=backDestination></back-button></header><div class=content><h2><span class=cornflower-txt><b>Support</b></span> For {{supportName}}</h2><div ng-show=showApiToken><div class=api-token>Api Token: {{device.blockcypher_api_token}}</div><div class=api-token-help>When you contact KeepKey support, we may ask for your API token. It helps us troubleshoot issues with your transactions and balances.</div></div><div class=menu><ul><li><button class=menu-item ng-click=launchSupportTab()>Web</button></li><li><button class=menu-item ng-click=openEmail()>Email {{supportEmailAddress}}</button></li></ul></div><notification></notification></div><div class=footer><vendor-name></vendor-name>Firmware <span class=data>v{{device.major_version}}.{{device.minor_version}} Build #{{device.patch_version}}</span></div></section>'),
      e.put('app/popup/syncing/syncing.tpl.html', '<section id=syncing><header></header><div class=content><h2><span class=cornflower-txt><b>Syncing<vendor-name after=.></vendor-name></b></span><br>Please wait while we sync.</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div><notification></notification></div><footer ng-include="\'app/popup/footer/footer.tpl.html\'"></footer></section>'),
      e.put('app/popup/update-device/update-device.tpl.html', '<section id=firmware-available ng-controller=UpdateDeviceCtrl><div class=content><h2><span class=cornflower-txt><b>Device update</b> <span ng-if=skipable>available.</span> <span ng-if=!skipable>required.</span></span><p ng-if=deviceWipeRequired><i class="fa fa-exclamation-triangle" style="font-size: 60px;color: red;margin-top: 30px;"></i></p><p style="color: black; margin-bottom: 30px; padding: 10px; border: 3px solid black; display: block;" ng-if=deviceWipeRequired><b>YOUR SEED WILL BE WIPED BY THIS OPERATION. YOU WILL HAVE TO REINITIALIZE YOUR KEEPKEY. MAKE SURE THAT YOU HAVE YOUR SEED WORDS AVAILABLE BEFORE PROCEEDING.</b><br><b>If you are not sure how to recover your KeepKey, DO NOT CONTINUE. Unplug your KeepKey and contact support. We will let you know when you can upgrade without wiping your device.</b><br>Please contact <a href=mailto:support@keepkey.com target=_blank>support@keepkey.com</a> with any questions.</p><p>Unplug your KeepKey, then hold down the button while plugging it in to start the device update.</p></h2><a class="text-link-button cancel" ng-if=skipable ng-click=goToTop(false)>Skip</a><notification></notification></div></section>'),
      e.put('app/popup/verify/verify.tpl.html', '<section id=verify-device ng-controller=VerifyController><div class="layout starting-layout" ng-if=true><h1>Let\u2019s get started.</h1><p>We are going to verify that your KeepKey is secure and has not been tampered with.</p><p>This process is automatic, and should take less than two minutes. <b style=color:#333;>If the process is stopped, you will need to start again from the beginning.</b></p><i class="fa fa-check-square" ng-if=step1Done></i> <a class=button ng-click=startValidation()>Check your<vendor-name></vendor-name></a><p ng-show=status.step>Step: <span ng-bind=status.step></span></p><p ng-show=status.result>Result: <span ng-bind=status.result></span></p><p ng-show=status.sectorName>SectorName: <span ng-bind=status.sectorName></span></p></div></section>'),
      e.put('app/popup/wallet/wallet.tpl.html', '<section id=wallet ng-controller=WalletController><header><back-button ng-hide=singleAccount class="button-left header-button"></back-button><settings-button ng-show=singleAccount class="button-left header-button"></settings-button><refresh-button class="button-right header-button"></refresh-button></header><div class=content><account-balance account=wallet loading=receiveDisabled() name-display=name single-account=singleAccount account-settings=accountSettings currency=currency fresh=fresh></account-balance><div class=menu><ul><li ng-if=firmwareUpdateAvailable><button class="menu-item notification" ng-click="go(\'/update-device\')" ng-show=firmwareUpdateAvailable>Update Firmware</button></li><li><button class=menu-item ng-click=send() ng-disabled=!sendAllowed()>Send/Trade {{sendCurrencyName}}</button></li><li><button class=menu-item ng-click=receive() ng-disabled=receiveDisabled()>Receive {{receiveCurrencyName}}</button></li><li><button class=menu-item ng-click=showTransactions()>Transactions</button></li><li><button class=menu-item ng-click=viewXPub() ng-show=!isSingleAddressAccount>View XPub Address</button></li><li ng-if=offerKeepKeyPurchase><button class=menu-item ng-click=openBuyKeepkeyWindow()>Buy a KeepKey</button></li><notification></notification></ul></div><div class=subaccounts ng-if=showSubAccounts><ul><li ng-repeat="subAccount in subAccounts" class=subaccount><img ng-src="assets/currency-logos/{{ subAccount.coinType | lowercase }}.png"><div class=asset-name>{{subAccount.coinType}}</div><formatted-amount ng-hide=loading amount=subAccount.balance currency=subAccount.coinType></formatted-amount><exchange-formatted-amount ng-hide=loading amount=subAccount.balance currency=subAccount.coinType></exchange-formatted-amount><button class="fa fa-list" ng-show=!isToken(subAccount.coinType) ng-click=showTransactions(subAccount.coinType) uib-tooltip="{{subAccount.coinType}} Transactions" tooltip-placement=top-right tooltip-popup-delay=500></button> <button class="fa fa-paper-plane-o" ng-click=send(subAccount.coinType) ng-disabled=!sendAllowed(subAccount.coinType) uib-tooltip="Send/Trade {{subAccount.coinType}}" tooltip-popup-delay=500></button></li></ul></div></div><div class=footer><div class=left><strong><device-label></device-label></strong> connected</div><div class="new-account-link text-link-button right" ng-if=singleAccount ng-click="go(\'/accountConfig\', \'slideLeft\')">Add Account</div><div class="wallet-name right" ng-if=!singleAccount ng-disabled=receiveDisabled()>{{data.coinType}} Account #{{wallet.accountNumber}}</div></div><notification-message></notification-message></section>'),
      e.put('app/popup/walletConfig/walletConfig.tpl.html', '<section id=wallet-config ng-controller=WalletConfigController><header><back-button class="button-left header-button"></back-button><a class="button-right header-button refresh-button" ng-click=refresh()><div class="icon icon-refresh"></div></a></header><div class=content><div class="wallet online"><div class="account-form container"><header>Account Settings</header><div class=row><div class="label-column col-xs-4">Account ID:</div><div class="data-column col-xs-8"><div ng-bind=data.id></div></div></div><div class=row><div class="label-column col-xs-4">Name:</div><div class="data-column col-xs-8"><div contenteditable=true strip-br=true strip-tags=true nolinebreaks=true ng-model=wallet.name></div></div></div><div class=row><div class="label-column col-xs-4">Node path:</div><div class="data-column col-xs-8"><div ng-bind=data.nodePath></div></div></div><div class=row><div class="label-column col-xs-4">xpub:</div><div class="data-column col-xs-8"><div ng-bind=data.data.xpub></div></div></div></div></div><div class=menu><ul><li><button class=menu-item ng-click=delete()>Delete Account</button></li></ul></div></div><div class=footer><strong><device-label></device-label></strong> connected</div></section>'),
      e.put('app/popup/walletlist/header.tpl.html', '<header><settings-button class="button-left header-button"></settings-button><refresh-button class="button-right header-button"></refresh-button></header>'),
      e.put('app/popup/walletlist/loading.tpl.html', '<div class=content><div class=content-no-button-inner><div class=content-inner-centering><h2><span class=cornflower-txt><b>Loading Accounts.</b></span><br>Please wait while accounts<br>and balances are loaded...</h2><div id=loader><div></div><div></div><div></div><div></div><div></div><div class=second-top></div><div class=top></div></div></div></div></div>'),
      e.put('app/popup/walletlist/walletlist.tpl.html', '<section id=wallet-list ng-controller=WalletListController><div ng-hide=loaded><ng-include src="\'app/popup/walletlist/loading.tpl.html\'"></ng-include></div><div class=wallet-fade ng-hide=!showWalletList()><ng-include src="\'app/popup/walletlist/header.tpl.html\'"></ng-include><ng-include src="\'app/popup/walletlist/wallets.tpl.html\'"></ng-include><div class=button-footer><div class=left><strong><device-label></device-label></strong></div><div class=textButton><button class="fa fa-plus footer-button" ng-click="go(\'/accountConfig\', \'slideLeft\')" uib-tooltip="Add Account" tooltip-popup-delay=500 tooltip-placement="auto top"></button><div>Add Account</div></div><div class=textButton><button class="fa fa-exchange footer-button ss-button" ng-click="go(\'/exchange\', \'slideLeft\')" uib-tooltip=ShapeShift tooltip-popup-delay=500 tooltip-placement="auto top"></button><div>Trade</div></div></div></div><notification></notification><notification-message can-notify=showWalletList()></notification-message></section>'),
      e.put('app/popup/walletlist/wallets.tpl.html', '<div class=wallet-list-container ng-class="{\'filters-hidden\': !showFilters}"><div class=wallets><div ng-if=messages class=wallet><notification></notification></div><div class=ssSignup ng-click="signup(\'banner\', \'https://shapeshift.com/fox-token\')"><img src=assets/img/macbook_mockup_2.png><p class=title>Trade Crypto for Free in the<br>ShapeShift Platform</p><div layout=column class=ssButtonContainer><div class=ssbutton>GET STARTED</div></div></div><div class=wallet-group ng-repeat="walletGroup in walletGroups | orderBy : [\'coinType\'] track by walletGroup.coinType"><div class="wallet online" ng-repeat="wallet in walletGroup.wallets | orderBy : [\'accountNumber\'] track by wallet.id" ng-click=goWallet(wallet)><div ng-show=fresh.status class=connection-light></div><div ng-hide=fresh.status class=refreshing-balance><i class="fa fa-refresh fa-spin" aria-hidden=true></i></div><img ng-src="assets/currency-logos/{{ wallet.coinType | lowercase }}.png"><div class=go-side><div class=go-btn><a class=wallet-link><div class="icon icon-forward"></div></a></div></div><div class=details><div class=wallet-name ng-bind=wallet.name></div><div><wallet-balance balance=wallet.balance currency=wallet.coinType></wallet-balance><div class=account-number>Account #{{wallet.accountNumber}}</div></div></div></div></div></div></div>'),
      e.put('app/popup/wordRequest/wordRequest.tpl.html', '<div ng-controller=WordRequestController><header><back-button class="button-left header-button" destination="\'/initialize\'"></back-button></header><div class=content><h2><span class=cornflower-txt><b>Enter the word requested by your</b></span><vendor-name></vendor-name></h2><form name=form novalidate><div class=form-input-container><label>Word</label> <input name=deviceLabel type=text placeholder="Requested word" ng-model=word required focus></div><button class=button type=submit ng-click=send()>Send</button></form></div></div>')
  }]);
