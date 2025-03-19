
# mns-contracts
MNS Smart Contracts

## Install
to install dependencies, run the following command.

```shell
npm install
``` 

## Set .env
Set your variables on .env file. rename .env.template file as .env

```shell
BLOCKVISION_API_KEY=
DEPLOYER_PRIVATE_KEY=
```

## Compile
```shell
npx  hardhat  compile  --network  monadtestnet
```

## Deploy
to deploy contracts on Monad testnet, run the following command. ensure your account have sufficient balance of MON.
```shell
npx  hardhat  run  scripts/deploy.js  --network  monadtestnet
```

## Verfiy
to verify your contracts on Blockvision, run the following commnad

```shell
npx  hardhat  verify  --network  monadtestnet  {{CONTRACT_ADDRESS}}  {{CONTRACT_DEPLOYMENT_PARAMETERS}}
```

## Deployed Contracts
|Contract| Monad Testnet | Monad Mainnet |
|--|--|--|
| Registry | 0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E | |
| ReverseRegistrar | 0x604bdEE35ebC13ef233f6b4e20613061fDf5C7E5 | |
| BaseRegistrar | 0x01BeCD733ea490CCDa8B5Caa97381E67BFA5249D | |
| MONRegistrarController | 0x6C8a8114dA4EED8A2662B4069418e574411A5540 | |
| PublicResolver | 0x4569B7AE2e1C13Bb812fEefee06e56a12E67471F | |
| NameWrapper | 0x08Ca5c9e59d6Fc12BAb8DBa50825DaE57BBa9932 | |

