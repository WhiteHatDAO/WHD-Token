
require('dotenv').config()
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");


task("accounts", "👩🕵👨🙋👷 Prints the list of accounts (only for localhost)", async () => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  console.log("👩🕵 👨🙋👷 these accounts only for localhost network.");
  console.log('To see their private keys🔑🗝 when you run "npx hardhat node."');
});


module.exports = {
  etherscan: {
    apiKey: process.env.bscAPIKey

  },

  defaultNetwork: "sepolia", 

  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000",
        count: 10,
      }
    },
    
    localhost: {
      url: "http://127.0.0.1:8545"
    },

    Ganache: {
      url: "http://127.0.0.1:7545"
    },

    bscTestnet: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },

    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 4,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },

    maticTestnet: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/IG7pWzRCXsdYf740rjB-g-z_m1_v5rHY",
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey,"891eae0c1295f24bc99d87f3b12ad6b407b922326ac6cf2fd165194b6b608684","a54519a6da87c7e6b7a08d07f26d582c3ffcce9a6d94da65f3e6abdb5a62b933","5346d09c19f5c015c0092cf5463262a5c0d9eac663170b4dc00a6c16e8b2025f","83612c2f9d05808436ffece38cd3d5536a441af682908d402d2db4669e756ba6"]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/47c3c405d0454304b32e0c8101924aa6",
      chainId: 5,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/RpIy88kL-326nZwceDkFI3SaIW8VGjlN",
      chainId: 11155111,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    arbitrum_goerli: {
      url: "https://arbitrum-goerli.publicnode.com",
      chainId: 421613,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    optimism_goerli: {
      url: "https://goerli.optimism.io",
      chainId: 420,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    bnb_testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
    avalanche_testnet: {
      url: "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    },
   klaytn_testnet: {
      url: "https://public-node-api.klaytnapi.com/v1/baobab",
      chainId: 1001,
      gasPrice: 20000000000,
      accounts: [process.env.privateKey]
    }
   
  },

  gasReporter: {
    enabled: false
  },

  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
    overrides: {
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  mocha: {
    timeout: 2000000
  }
};
