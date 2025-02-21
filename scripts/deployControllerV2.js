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
  
  
  //const monRegistrarController = await ethers.deployContract("MONRegistrarControllerV2",["0x01BeCD733ea490CCDa8B5Caa97381E67BFA5249D", "0xCEA1315D892CD9e0E17BDdcc5b8c1Bdf0066dc6E", "0x604bdEE35ebC13ef233f6b4e20613061fDf5C7E5", "0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E"]);
  //await monRegistrarController.waitForDeployment();
  //console.log(`monRegistrarControllerV2 Deployed: ${monRegistrarController.target}`)


  // 0x01BeCD733ea490CCDa8B5Caa97381E67BFA5249D > addController yap.
  // 0x604bdEE35ebC13ef233f6b4e20613061fDf5C7E5 > setController yap. 
  // deploy new resolver with controller address.

  //const publicResolver = await ethers.deployContract("PublicResolver",["0x6442eC5c3CCDaF112d6B78F9189cD111d516fE1E", "0x04894Bf8F0ca6370C0fd8F5FCE3158033b46d979", "0x604bdEE35ebC13ef233f6b4e20613061fDf5C7E5"]);
  //await publicResolver.waitForDeployment();
  //console.log(`PublicResolver Deployed: ${publicResolver.target}`)


  console.log(namehash.hash("resolver"))
  //await publicResolver['setAddr(bytes32,address)'](namehash.hash("resolver"), publicResolver.target);
  //await registry.setResolver(namehash.hash("resolver"), publicResolver.target);
}
  
 

  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});