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
    
  const registry = await deployRegistry();

  await setupRegistry(registry, deployer);

  const registryWithFallback = await deployRegistryWithFallback(registry);
 
  await setupRegistry(registryWithFallback, deployer);
   
  const registrar = await deployRegistrar(registryWithFallback, tld);
 
  await setupRegistrar(registryWithFallback, registrar);

  const reverseRegistrar = await deployReverseRegistrar(registryWithFallback);

  await setupReverseRegistrar(registryWithFallback, registrar, reverseRegistrar, deployer)

  const baseRegistrarImplementation = await deployBaseRegistrarImplementation(registryWithFallback);

  await setupBaseRegistrarImplementation(registryWithFallback, baseRegistrarImplementation);
 
  const stablePriceOracle = await deployStablePriceOracle();

  //await setupStablePriceOracle(stablePriceOracle, ethers.parseEther("0.00001582318"), ethers.parseEther("0.00000631024"), ethers.parseEther("0.00000313926"), ethers.parseEther("0.00000155377"), ethers.parseEther("1.5854896"));

  //const monRegistrarController = await deployMonRegistrarController(baseRegistrarImplementation, stablePriceOracle, 5, 86400, reverseRegistrar, registryWithFallback);

  const monRegistrarController = await deployMonRegistrarController(baseRegistrarImplementation, stablePriceOracle, reverseRegistrar, registryWithFallback);
  
  await setupMonRegistrarController(reverseRegistrar, baseRegistrarImplementation, monRegistrarController);
  
  const publicResolver  = await deployPublicResolver(registryWithFallback, monRegistrarController, reverseRegistrar);

  await setupResolver(registryWithFallback, publicResolver)
}
 
async function deployRegistry() { 
  const registry = await ethers.deployContract("ENSRegistry");
  await registry.waitForDeployment();
  console.log(`Registry Deployed: ${registry.target}`);
  return registry;
}

async function deployRegistryWithFallback(registry) { 
  const registryWithFallback = await ethers.deployContract("ENSRegistryWithFallback", [registry.target]);
  await registryWithFallback.waitForDeployment();
  console.log(`RegistryWithFallback Deployed: ${registryWithFallback.target} with params: ${registry.target}`);
  return registryWithFallback;
}

async function deployRegistrar(registry, tld) { 
  const registrar = await ethers.deployContract("FIFSRegistrar", [registry.target, namehash.hash(tld)]); 
  await registrar.waitForDeployment();
  console.log(`FIFSRegistrar Deployed: ${registrar.target} with the params: ${registry.target}, ${namehash.hash(tld)}`)
  return registrar;
}
 
async function deployReverseRegistrar(registry) { 
  const reverseRegistrar = await ethers.deployContract("ReverseRegistrar", [registry.target]);
  await reverseRegistrar.waitForDeployment();
  console.log(`ReverseRegistrar Deployed: ${reverseRegistrar.target} with the params: ${registry.target}`);
  return reverseRegistrar;
}
  
async function deployBaseRegistrarImplementation(registry) { 
  const baseRegistrarImplementation = await ethers.deployContract("BaseRegistrarImplementation",[registry.target, namehash.hash(tld)]);
  await baseRegistrarImplementation.waitForDeployment();
  console.log(`BaseRegistrarImplementation Deployed: ${baseRegistrarImplementation.target} with the params: ${registry.target} ${namehash.hash(tld)}`)
  return baseRegistrarImplementation;
}

async function deployStablePriceOracle() { 
  const stablePriceOracle = await ethers.deployContract("StablePriceOracle");
  await stablePriceOracle.waitForDeployment();
  console.log(`StablePriceOracle Deployed: ${stablePriceOracle.target}`)
  return stablePriceOracle;
}

async function deployMonRegistrarController(baseRegistrarImplementation, stablePriceOracle, reverseRegistrar, registry) { 
  const monRegistrarController = await ethers.deployContract("MONRegistrarControllerV2",[baseRegistrarImplementation.target, stablePriceOracle.target, reverseRegistrar.target, registry.target]);
  await monRegistrarController.waitForDeployment();
  console.log(`monRegistrarController Deployed: ${monRegistrarController.target} with the params: ${baseRegistrarImplementation.target} ${stablePriceOracle.target} ${minCommitmentAge} ${maxCommitmentAge} ${reverseRegistrar.target} ${registry.target}`)
  return monRegistrarController;
}

async function deployPublicResolver(registry, monRegistrarController, reverseRegistrar) { 
  const publicResolver = await ethers.deployContract("PublicResolver",[registry.target, monRegistrarController.target, reverseRegistrar.target]);
  await publicResolver.waitForDeployment();
  console.log(`PublicResolver Deployed: ${publicResolver.target} with the params; ${registry.target} ${monRegistrarController.target} ${reverseRegistrar.target}`)
  return publicResolver;
}

 
async function setupRegistry(registry, deployer) { 
  await registry.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), deployer);
  await registry.setSubnodeOwner(ZERO_HASH, labelhash("resolver"), deployer);
  console.log(`Completed setupRegistry.`)
}

async function setupRegistrar(registry, registrar) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.target);
  console.log(`Completed setupRegistrar.`)
}
 
async function setupReverseRegistrar(registry, registrar, reverseRegistrar, deployer) {
  await registry.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.target);
  console.log(`Completed Setup Reverse Register Owner.`)
}

async function setupBaseRegistrarImplementation(registry, baseRegistrarImplementation) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), baseRegistrarImplementation.target);
  console.log(`Completed setupBaseRegistrarImplementation.`)
}

async function setupStablePriceOracle(stablePriceOracle, priceLetter1, priceLetter2, priceLetter3, priceLetter4, priceLetter5) {
  await stablePriceOracle.setPrices([priceLetter1, priceLetter2, priceLetter3, priceLetter4, priceLetter5]);  
  console.log(`Completed setupStablePriceOracle.`)
}

async function setupMonRegistrarController(reverseRegistrar, baseRegistrarImplementation, monRegistrarController) {
  await baseRegistrarImplementation.addController(monRegistrarController.target);
  await reverseRegistrar.setController(monRegistrarController.target, true);
  console.log(`Completed setupMonRegistrarController.`)
}
 
async function setupResolver(registry, publicResolver) { 
  await publicResolver['setAddr(bytes32,address)'](namehash.hash("resolver"), publicResolver.target);
  await registry.setResolver(namehash.hash("resolver"), publicResolver.target);
  console.log(`Completed setupResolver`)
}
  

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});