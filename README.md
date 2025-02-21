
# mns-contracts

Monad Domains smart contracts

## Install

to install dependencies, run the following command.

```shell

npm install

``` 

## Set .env

Set you API keys on .env file. rename .env.template file as .env

```shell

ALCHEMY_API_KEY=

ETHER_SCAN_API_KEY=

DEPLOYER_PRIVATE_KEY=

```

## Compile

```shell

npx  hardhat  compile  --network  sepolia

```

## Deploy

to deploy contracts on Ethereum Sepolia testnet, run the following command. ensure your account have sufficient balance of ETH.

```shell

npx  hardhat  run  scripts/deploy.js  --network  sepolia

```


## Verfiy

to verify your contracts on Ethereum Sepolia, you need to get your API key from etherscan.io and set your key on .env file

```shell
npx  hardhat  verify  --network  sepolia  {{CONTRACT  ADDRESS}}  {{CONTRACT  DEPLOYMENT  PARAMETERS}}
```

## Deployed Contracts
|Contract| Monad Testnet | Monad Mainnet |
|--|--|--|
| MONRegistrarController | 0x04894Bf8F0ca6370C0fd8F5FCE3158033b46d979 | |
| BaseRegistrarImplementation | 0x01BeCD733ea490CCDa8B5Caa97381E67BFA5249D | |
| PublicResolver | 0x9F64406E0ef653074F8aF8178f0717e766A32764 | |
| StablePriceOracle | 0x62375065222890a0Cc4FDD3D89c3dD3AC2850708 | |
| Registry | 0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E | |
| FIFSRegistrar | 0x84bceE5bB22ED7009dD8Af44fb4b74088c4F4C15 | |
| ReverseRegistrar | 0x604bdEE35ebC13ef233f6b4e20613061fDf5C7E5 | |
