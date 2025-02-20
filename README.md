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
npx hardhat compile --network sepolia
```

## Deploy
to deploy contracts on Ethereum Sepolia testnet, run the following command. ensure your account have sufficient balance of ETH. 
```shell
npx hardhat run scripts/deploy.js --network sepolia
```

## Verfiy
to verify your contracts on Ethereum Sepolia, you need to get your API key from etherscan.io and set your key on .env file 

```shell
npx hardhat verify --network sepolia {{CONTRACT ADDRESS}} {{CONTRACT DEPLOYMENT PARAMETERS}}
```