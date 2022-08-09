import { APITOKENS } from './apitokens.js'
export const CONFIG =
{
  supportsEthereum: !0,
  confidenceThreshholds:
  {
    highConfidence: .98,
    acceptableDelta: .001
  },
  defaultAccounts: [
  {
    name: "Main Account",
    hdNode: "m/44'/0'/0'"
  }],
  cliLogLevel: "warn",
  chromeLogLevel: "info",
  metadataApiToken: APITOKENS.METADATA_API_TOKEN,
  firebaseId: APITOKENS.FIREBASE_ID,
  transactionReloadThrottle: 3e4,
  feeReloadThrottle: 1e4,
  ValueTransferGasLimit: 36e3,
  TransactionTimeout: 6e5,
  ShapeShiftApiPublicKey: "6ad5831b778484bb849da45180ac35047848e5cac0fa666454f4ff78b8c7399fea6a8ce2c7ee6287bcd78db6610ca3f538d6b3e90ca80c8e6368b6021445950b",
  ShapeShiftSignatureKey: "1HxFWu1wM88q1aLkfUmpZBjhTWcdXGB6gT",
  EtherscanApiToken: APITOKENS.EtherscanApiToken,
  firmware:
  {
    repository: "keepkey-firmware",
    tag: "v4.0.0"
  },
  environment: "prod",
  jsonIndent: 0,
  keepkeyProxy:
  {
    applicationId: "idgiipeogajjpkgheijapngmlbohdhjg"
  },
  keepkeyWallet:
  {
    applicationId: "hmldnhmidmcofnbojkgfnibmhmjopbpc"
  },
  selectedFeeService: "btcfee",
  feeServices:
  {
    btcfee:
    {
      url: "https://btc-fee.net/api.json",
      bytesPerFee: 1,
      feePaths:
      {
        fast: "fast",
        medium: "medium",
        slow: "slow"
      }
    },
    blkhub:
    {
      url: "https://blkhub.net/api/fee-estimates",
      bytesPerFee: 1,
      feePaths:
      {
        fast: "4",
        medium: "144",
        slow: "504"
      }
    },
    mempoolspace:
    {
      url: "https://mempool.space/api/v1/fees/recommended",
      bytesPerFee: 1,
      feePaths:
      {
        fast: "fastestFee",
        medium: "halfHourFee",
        slow: "hourFee"
      }
    },
    earn:
    {
      url: "https://bitcoinfees.earn.com/api/v1/fees/recommended",
      bytesPerFee: 1,
      feePaths:
      {
        fast: "fastestFee",
        medium: "halfHourFee",
        slow: "hourFee"
      }
    },
    coinquery:
    {
      url: "https://coinquery.com/fees.json",
      bytesPerFee: 1,
      feePaths:
      {
        fast: "fastestFee",
        medium: "halfHourFee",
        slow: "hourFee"
      }
    },
    blockcypher:
    {
      url: "http://api.blockcypher.com/v1/btc/main",
      bytesPerFee: 1e3,
      feePaths:
      {
        fast: "high_fee_per_kb",
        medium: "medium_fee_per_kb",
        slow: "low_fee_per_kb"
      }
    }
  },
  selectedGasService: "etherchain",
  gasServices:
  {
    etherscan:
    {
      url: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
      gasPaths:
      {
        fast: "result",
      }
    },
    etherchain:
    {
      url: "https://etherchain.org/api/gasnow",
      gasPaths:
      {
        fast: "data.fast",
        medium: "data.standard",
        slow: "data.slow",
      }
    },
  },
  environmentConfig:
  {
    showFeeSelector: true,
    regularFeeLevel: "fast",
    maxReceiveAddresses: 10,
    notificationInterval: 12e4,
    showFiatBalance: true
  },
  membershipPlatform:
  {
    url: "https://auth.shapeshift.io",
    clientId: "d55063d8-7e56-4e46-bdd0-1163462e1972"
  },
  notificationConfig:
  {
    notificationUrl: "https://notifications.keepkey.com/notifications.prod.json.asc",
    publicKey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: GnuPG v1\n\n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\nzB7/4+PfYlDvDLA+\n=qeAm\n-----END PGP PUBLIC KEY BLOCK-----"
  }
}