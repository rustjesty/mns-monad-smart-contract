const { expect } = require("chai");
const randomstring = require("randomstring");

const namehash = require('eth-ens-namehash');
const tld = "mon"; 
const labelhash = (label) => ethers.keccak256(ethers.toUtf8Bytes(label))
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";



describe("Controller Contract", function () {

    let registry;
    let registryWithFallback;
    let registrar;
    let reverseRegistrar;
    let publicResolver;
    let baseRegistrarImplementation;
    let stablePriceOracle;
    let monRegistrarController;

    let domain = "mns";

 
    it("Should register", async function() {
        const [deployer, user1] = await ethers.getSigners(); 

        await deploy(deployer);

        await expect(  
            monRegistrarController.connect(user1).register("name", user1, 31536000, publicResolver.target, [], true)
        )
    });  
    
      
    async function deploy(deployer) {

        registry = await ethers.deployContract("ENSRegistry");
        await registry.waitForDeployment();

        await registry.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), deployer);
        await registry.setSubnodeOwner(ZERO_HASH, labelhash("resolver"), deployer);

        registryWithFallback = await ethers.deployContract("ENSRegistryWithFallback", [registry.target]);
        await registryWithFallback.waitForDeployment();

        await registryWithFallback.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), deployer);
        await registryWithFallback.setSubnodeOwner(ZERO_HASH, labelhash("resolver"), deployer);

        registrar = await ethers.deployContract("FIFSRegistrar", [registryWithFallback.target, namehash.hash(tld)]); 
        await registrar.waitForDeployment();

        await registryWithFallback.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.target);
        
        reverseRegistrar = await ethers.deployContract("ReverseRegistrar", [registryWithFallback.target]);
        await reverseRegistrar.waitForDeployment();
 
        await registryWithFallback.setSubnodeOwner(namehash.hash("reverse"), labelhash("addr"), reverseRegistrar.target);
         
        baseRegistrarImplementation = await ethers.deployContract("BaseRegistrarImplementation",[registryWithFallback.target, namehash.hash(tld)]);
        await baseRegistrarImplementation.waitForDeployment(); 

        await registryWithFallback.setSubnodeOwner(ZERO_HASH, labelhash(tld), baseRegistrarImplementation.target);
        
        stablePriceOracle = await ethers.deployContract("StablePriceOracle");
        await stablePriceOracle.waitForDeployment();

        // setup prices
        await stablePriceOracle.setPrices([ethers.parseEther("0.000000000000000025"), ethers.parseEther("0.000000000000000025"), ethers.parseEther("0.000000000000000025"), ethers.parseEther("0.000000000000000025"), ethers.parseEther("0.000000000000000025")]);  

        monRegistrarController = await ethers.deployContract("MONRegistrarControllerV2",[baseRegistrarImplementation.target, stablePriceOracle.target, reverseRegistrar.target, registryWithFallback.target]);
        await monRegistrarController.waitForDeployment();
  
        // setup base registarar imple.
        await baseRegistrarImplementation.addController(monRegistrarController.target);

        // setup monController
        await reverseRegistrar.setController(monRegistrarController.target, true);

        publicResolver = await ethers.deployContract("PublicResolver",[registryWithFallback.target, monRegistrarController.target, reverseRegistrar.target]);
        await publicResolver.waitForDeployment();
        await publicResolver['setAddr(bytes32,address)'](namehash.hash("resolver"), publicResolver.target);
        await registryWithFallback.setResolver(namehash.hash("resolver"), publicResolver.target);
    }
});


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }