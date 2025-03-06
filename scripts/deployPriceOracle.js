const {ethers, utils} = require("hardhat");
require("@nomicfoundation/hardhat-ethers");
 
const namehash = require('eth-ens-namehash');
const tld = "mon"; 
const labelhash = (label) => ethers.keccak256(ethers.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
 
   await deployWith();
   
};

async function deploy (){
  const MNSDeployer = await ethers.deployContract("MNSDeployer");
  await MNSDeployer.waitForDeployment();
  console.log(`MNSDeployer Deployed: ${MNSDeployer.target}`);
} 

async function deployWith() {
  const [deployer] = await ethers.getSigners();
  
  // priceOracleAddress: 0x2880aB155794e7179c9eE2e38200202908C17B43
  // feedId: 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace (ETH/USD)
   const stablePriceOracle = await deployStablePriceOracle(); 
}

// npx hardhat verify --constructor-args scripts/args.js --network monadtestnet 0x7C8239ED7D78E3fb3e6461A7C3c686eC7996Dad8

// npx hardhat verify --network monadtestnet 0x7C8239ED7D78E3fb3e6461A7C3c686eC7996Dad8 0x2880aB155794e7179c9eE2e38200202908C17B43 0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace 

async function deployStablePriceOracle() { 
    const stablePriceOracle = await ethers.deployContract("StablePriceOracleV2", [
        "0x2880aB155794e7179c9eE2e38200202908C17B43", 
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
        [   ethers.parseEther("0.000000000000001580"), 
            ethers.parseEther("0.000000000000000632"), 
            ethers.parseEther("0.000000000000000150"), 
            ethers.parseEther("0.000000000000000006"), 
            ethers.parseEther("0.000000000000000003")
        ]
    ]);
    await stablePriceOracle.waitForDeployment();
    console.log(`StablePriceOracle Deployed: ${stablePriceOracle.target}`)
    return stablePriceOracle;
}
  
  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});