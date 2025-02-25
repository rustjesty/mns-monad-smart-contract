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
  
  //const stablePriceOracle = await deployStablePriceOracle();

  
  
  const stablePriceOracle = await (await ethers.getContractFactory("StablePriceOracle")).attach("0x62375065222890a0Cc4FDD3D89c3dD3AC2850708")
 
  await setupStablePriceOracle(stablePriceOracle, ethers.parseEther("0.000000000000001580"), ethers.parseEther("0.000000000000000632"), ethers.parseEther("0.000000000000000008"), ethers.parseEther("0.000000000000000004"), ethers.parseEther("0.000000000000000002"));


   
  const result = await stablePriceOracle.connect(deployer).price("1", 31536000);
  console.log("Price Letter 1:"+  ethers.formatEther(result[0]));

  const result2 = await stablePriceOracle.connect(deployer).price("22", 31536000);
  console.log("Price Letter 2:"+  ethers.formatEther(result2[0]));

  const result3 = await stablePriceOracle.connect(deployer).price("333", 31536000);
  console.log("Price Letter 3:"+  ethers.formatEther(result3[0]));

  const result4 = await stablePriceOracle.connect(deployer).price("4444", 31536000);
  console.log("Price Letter 4:"+  ethers.formatEther(result4[0]));

  const result5 = await stablePriceOracle.connect(deployer).price("55555", 31536000);
  console.log("Price Letter 5:"+  ethers.formatEther(result5[0]));

  const result6 = await stablePriceOracle.connect(deployer).price("666666", 31536000);
  console.log("Price Letter 6:"+  ethers.formatEther(result6[0]));
        
}

async function setupStablePriceOracle(stablePriceOracle, priceLetter1, priceLetter2, priceLetter3, priceLetter4, priceLetter5) {
    await stablePriceOracle.setPrices([priceLetter1, priceLetter2, priceLetter3, priceLetter4, priceLetter5]);  
    console.log(`Completed setupStablePriceOracle.`)
  }

async function deployStablePriceOracle() { 
    const stablePriceOracle = await ethers.deployContract("StablePriceOracle");
    await stablePriceOracle.waitForDeployment();
    console.log(`StablePriceOracle Deployed: ${stablePriceOracle.target}`)
    return stablePriceOracle;
  }
  
 

  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});