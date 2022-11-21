export default function(confighelper)
{
  const
  {
    b58regex,
    slip044map,
    newDustCalculation, oldDustCalculation
  } = confighelper
  let config =
  [
    {
      name: slip044map("Bitcoin", 0),
      addressFormat: "(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^(bc1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://mainnet-explorer.wakiyamap.dev",
      ],
      txUrlExplorer: "https://explorer.bitcoin.com/btc/tx/",
      feeProfile:
      {
        MIN_FEE: 1e3,
        servicer: 'bitcoin-fee-service'
      }
    },
    {
      name: slip044map("Testnet", 1),
      addressFormat: "(^[2mn][a-km-zA-HJ-NP-Z1-9]{25,34}$)",
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://tbtc1.trezor.io",
        "https://tbtc2.trezor.io",
      ],
      txUrlExplorer: "https://bitpay.com/insight/#/BTC/testnet/tx/",
      feeProfile:
      {
        MIN_FEE: 1e3,
        servicer: 'granular-fee-service'
      }
    },
    {
      name: slip044map("Litecoin", 2),
      addressFormat: "(^[LM][a-km-zA-HJ-NP-Z1-9]{26,33}$)|(^(ltc1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
      dust: newDustCalculation(100000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://blockbook.ltc.zelcore.io",
      ],
      txUrlExplorer: "https://blockchair.com/litecoin/transaction/",
      feeProfile:
      {
        INPUT_SIZE: 149,
        MIN_FEE: 1e4,
      }
    },
    {
      name: slip044map("Dogecoin", 3),
      addressFormat: "^[DA9][1-9A-HJ-NP-Za-km-z]{33}$",
      dust: "100000000",
      defaultDecimals: 8,
      blockbook:
      [
        "https://dogecoin.blockbook.chains.klever.io",
      ],
      txUrlExplorer: "https://blockchair.com/dogecoin/transaction/",
      feeProfile:
      {
        MIN_FEE: 1e8,
        servicer: 'roundup-per-kb-fee-service'
      }
    },
    {
      name: slip044map("Reddcoin", 4),
      addressFormat: b58regex('R'),
      dust: 1e8,
      defaultDecimals: 8,
      blockbook:
      [
        "https://rddblockexplorer.com",
      ],
      txUrlExplorer: "https://live.reddcoin.com/tx/",
      feeProfile:
      {
        TRANSACTION_HEADER_SIZE: 14,
        MIN_FEE: 1e3
      }
    },
    {
      name: slip044map("Dash", 5),
      addressFormat: b58regex('[X7]', 1),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      supportsInstantSend: true,
      blockbook:
      [
        "https://dash.atomicwallet.io",
      ],
      txUrlExplorer: "https://insight.dash.org/insight/tx/",
      feeProfile:
      {
        MIN_FEE: 1e3,
        servicer: 'granular-per-kb-fee-service'
      }
    },
    {
      name: slip044map("Namecoin", 7),
      addressFormat: b58regex('[NM]', 1),
      dust: oldDustCalculation(10000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://nmc1.trezor.io",
      ],
      txUrlExplorer: "https://nmc.tokenview.io/en/tx/",
      feeProfile:
      {
        MIN_FEE: 1e5,
        servicer: 'granular-per-kb-fee-service'
      }
    },
    {
      name: slip044map("Groestlcoin", 17),
      addressFormat: b58regex('[F3]', 1),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://blockbook.groestlcoin.org"],
      txUrlExplorer: "https://blockchair.com/groestlcoin/transaction/"
    },
    {
      name: slip044map("DigiByte", 20),
      addressFormat: b58regex('[DS]', 1),
      dust: oldDustCalculation(10000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://digiexplorer.info",
      ],
      txUrlExplorer: "https://digiexplorer.info/tx/",
      feeProfile:
      {
        MIN_FEE: 2e3
      }
    },
    {
      name: slip044map("Monacoin", 22),
      addressFormat: b58regex('[MP]', 1),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://blockbook.electrum-mona.org",
      ],
      txUrlExplorer: "http://chaintools.mona-coin.de/tx/",
      feeProfile: { MIN_FEE: 2e3 }
    },
    {
      name: slip044map("Vertcoin", 28),
      addressFormat: b58regex('[V3]', 1),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://blockbook.javerity.com",
      ],
      txUrlExplorer: "http://insight.vertcoin.org/tx/",
      feeProfile: { MIN_FEE: 1e5 }
    },
    {
      name: slip044map("Syscoin", 57),
      addressFormat: b58regex('S'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://sys1.bcfn.ca",
      ],
      txUrlExplorer: "https://chainz.cryptoid.info/sys/tx.dws?",
      feeProfile: { MIN_FEE: 1e4 }
    },
    {
      name: slip044map("Ethereum", 60),
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18,
      blockbook:
      [
        "https://eth1.trezor.io",
        "https://eth2.trezor.io",
      ],
      txUrlExplorer: "https://etherscan.io/tx/",
      feeProfile:
      {
        gasLimit: 21e3,
        servicer: 'ethereum-fee-service'
      }
    },
    {
      name: slip044map("Fujicoin", 75),
      addressFormat: b58regex('F'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://explorer.fujicoin.org",
      ],
      txUrlExplorer: "http://explorer.fujicoin.org/tx/",
      feeProfile: { MIN_FEE: 1e7 }
    },
    {
      name: slip044map("Pivx", 119),
      addressFormat: b58regex('D'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://pivx.flitswallet.app",
      ],
      txUrlExplorer: "https://zkbitcoin.com/tx/",
      feeProfile: { MIN_FEE: 1e4 }
    },
    {
      name: slip044map("Zcash", 133),
      addressFormat: b58regex('t1'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://zecblockexplorer.com",
      ],
      txUrlExplorer: "https://blockchair.com/zcash/transaction/",
      feeProfile:
      {
        TRANSACTION_HEADER_SIZE: 29,
        MIN_FEE: 1e3
      }
    },
    {
      name: slip044map("Firo", 136),
      addressFormat: b58regex('a'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook:
      [
        "https://blockbook.firo.org",
      ],
      txUrlExplorer: "https://insight.firo.org/tx/",
      feeProfile: { MIN_FEE: 1e3 }
    },
    {
      name: slip044map("Komodo", 141),
      addressFormat: b58regex('R'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://komodoblockexplorer.com"],
      txUrlExplorer: "https://kmdexplorer.io/tx/",
      feeProfile:
      {
        TRANSACTION_HEADER_SIZE: 29,
        MIN_FEE: 1e3
      }
    },
    {
      name: slip044map("BitcoinCash", 145),
      addressFormat: "(^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^bitcoincash:[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{25,55}$)|(^bitcoincash:[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{25,55}$)",
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://bch1.blockbook.bitaccess.net"],
      txUrlExplorer: "https://explorer.bitcoin.com/bch/tx/",
      feeProfile:
      {
        MIN_FEE: 1e3,
        servicer: 'granular-per-kb-fee-service'
      }
    },
    {
      name: slip044map("BitcoinGold", 156),
      addressFormat: "(^[AG][a-km-zA-HJ-NP-Z1-9]{25,34}$)|(^(btg1)[a-zA-HJ-NP-Z0-9]{25,39}$)",
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://bgold.atomicwallet.io"],
      txUrlExplorer: "https://explorer.bitcoingold.org/insight/tx/",
      feeProfile:
      {
        MIN_FEE: 1e3
      }
    },
    {
      name: slip044map("Ravencoin", 175),
      addressFormat: b58regex('R'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://blockbook.ravencoin.org"],
      txUrlExplorer: "https://ravencoin.network/tx/",
      feeProfile: { MIN_FEE: 1e6 }
    },
    {
      name: slip044map("SmartCash", 224),
      addressFormat: b58regex('S'),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      insight:
      [
        "https://insight.smartcash.cc/api",
      ],
      txUrlExplorer: "https://insight.smartcash.cc/tx/",
      feeProfile:
      {
        MIN_FEE: 1e5,
        servicer: 'roundup-per-kb-fee-service'
      }
    },
    // {
      // name: slip044map("BitcoinSV", 236),
      // addressFormat: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$",
      // dust: newDustCalculation(3000),
      // defaultDecimals: 8,
      // blockbook: ["https://bsvbook.guarda.co"],
      // txUrlExplorer: "https://blockchair.com/bitcoin-sv/transaction/",
      // feeProfile:
      // {
        // MIN_FEE: 1e3
      // }
    // },
    {
      name: slip044map("Qtum", 2301),
      addressFormat: b58regex('[QM]', 1),
      dust: newDustCalculation(3000),
      defaultDecimals: 8,
      blockbook: ["https://blockv3.qtum.info"],
      txUrlExplorer: "https://qtum.info/tx/",
      feeProfile:
      {
        MIN_FEE: 4e5
      }
    },
    {
      name: "Aragon",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Augur",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "BAT",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Civic",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "district0x",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "FunFair",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Gnosis",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Golem",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "OmiseGo",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "SALT",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Bancor",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "SingularDTV",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 0
    },
    {
      name: "ICONOMI",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "DigixDAO",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 9
    },
    {
      name: "Melon",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "SwarmCity",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Wings",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "WeTrust",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 6
    },
    {
      name: "iExec",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 9
    },
    {
      name: "Matchpool",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 3,
      exchangeForbidden: !0
    },
    {
      name: "Status",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Numeraire",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Edgeless",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 0,
      exchangeForbidden: !0
    },
    {
      name: "Metal",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "TenX",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Qtum ICO Token",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "0x",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "FirstBlood",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "RCN",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Storj",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "BinanceCoin",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Tether",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 6
    },
    {
      name: "PolyMath",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Zilliqa",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 12
    },
    {
      name: "Decentraland",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "0xBitcoin",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Gifto",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 5
    },
    {
      name: "IOSToken",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Aelf",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "TrueUSD",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Aeternity",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Maker",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Dai",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "SpankChain",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "CyberMiles",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "Crypto.com",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "Populous",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 8
    },
    {
      name: "ODEM",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    },
    {
      name: "FOX",
      addressFormat: "^(0x)?[0-9a-fA-F]{40}$",
      dust: 1,
      defaultDecimals: 18
    }
  ]
  return config
}
