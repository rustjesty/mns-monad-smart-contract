// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;
 
import {BaseRegistrarImplementation} from "./BaseRegistrarImplementation.sol";
import {StringUtils} from "./StringUtils.sol";
import {Resolver} from "../resolvers/Resolver.sol";
import {ENS} from "../registry/ENS.sol";
import {ReverseRegistrar} from "../reverseRegistrar/ReverseRegistrar.sol";
import {ReverseClaimer} from "../reverseRegistrar/ReverseClaimer.sol"; 

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ERC20Recoverable} from "../utils/ERC20Recoverable.sol";
import {IPriceOracle} from "./IPriceOracle.sol";
import {IMONRegistrarControllerV2} from "./IMONRegistrarControllerV2.sol"; 
 
error NameNotAvailable(string name);
error DurationTooShort(uint256 duration);
error ResolverRequiredWhenDataSupplied();
error ResolverRequiredWhenReverseRecord(); 
error InsufficientValue();
error Unauthorised(bytes32 node); 

/**
 * @dev A registrar controller for registering and renewing names at fixed cost.
 */
contract MONRegistrarControllerV2 is 
    Ownable,
    IERC165,
    ERC20Recoverable,
    ReverseClaimer
{
    using StringUtils for *;
    using Address for address;

    uint256 public constant MIN_REGISTRATION_DURATION = 28 days;
    bytes32 private constant MON_NODE = 0xc6467acde3662083e12f3fbcf8aef57155a035e49629628eb9453948d1afb379;
    uint64 private constant MAX_EXPIRY = type(uint64).max;
    BaseRegistrarImplementation immutable base;
    IPriceOracle public prices; 
    ReverseRegistrar public immutable reverseRegistrar; 

    event NameRegistered(
        string name,
        bytes32 indexed label,
        address indexed owner,
        uint256 baseCost,
        uint256 premium,
        uint256 expires
    );
    event NameRenewed(
        string name,
        bytes32 indexed label,
        uint256 cost,
        uint256 expires
    );

    constructor(
        BaseRegistrarImplementation _base,
        IPriceOracle _prices, 
        ReverseRegistrar _reverseRegistrar,
        ENS _ens
    ) ReverseClaimer(_ens, msg.sender) { 
        base = _base;
        prices = _prices; 
        reverseRegistrar = _reverseRegistrar;
    }

    function setPriceOracle(IPriceOracle _prices) external onlyOwner {
        prices = _prices;
    }

    function rentPrice(
        string memory name,
        uint256 duration
    ) public view  returns (IPriceOracle.Price memory price) {
        price = prices.price(name, duration);
    }

    function valid(string memory name) public pure returns (bool) {
        return name.strlen() >= 2;
    }

    function available(string memory name) public view  returns (bool) {
        bytes32 label = keccak256(bytes(name));
        return valid(name) && base.available(uint256(label));
    }
 
    function register(
        string calldata name,
        address owner,
        uint256 duration, 
        address resolver,
        bytes[] calldata data,
        bool reverseRecord 
    ) public payable {
        IPriceOracle.Price memory price = rentPrice(name, duration);
        if (msg.value < price.base + price.premium) {
            revert InsufficientValue();
        }
 
        bytes32 labelhash = keccak256(bytes(name));
        uint256 tokenId = uint256(labelhash);
        uint256 expires = base.register(tokenId, msg.sender, duration);

        if (data.length > 0) {
            _setRecords(resolver, keccak256(bytes(name)), data);
        }

        if (reverseRecord) {
            
            _setReverseRecord(name, resolver, msg.sender);
        }

        emit NameRegistered(
            name,
            keccak256(bytes(name)),
            owner,
            price.base,
            price.premium,
            expires
        );

        if (msg.value > (price.base + price.premium)) {
            payable(msg.sender).transfer(
                msg.value - (price.base + price.premium)
            );
        }
    }

    function renew(
        string calldata name,
        uint256 duration
    ) external payable  {
        bytes32 labelhash = keccak256(bytes(name));
        uint256 tokenId = uint256(labelhash);
        IPriceOracle.Price memory price = rentPrice(name, duration);
        if (msg.value < price.base) {
            revert InsufficientValue();
        }
         
        uint256 expires = base.renew(tokenId, duration);

        if (msg.value > price.base) {
            payable(msg.sender).transfer(msg.value - price.base);
        }

        emit NameRenewed(name, labelhash, msg.value, expires);
    }

    function withdraw() onlyOwner public {
        payable(owner()).transfer(address(this).balance);
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IMONRegistrarControllerV2).interfaceId;
    }
 
    function _setRecords(
        address resolverAddress,
        bytes32 label,
        bytes[] calldata data
    ) internal {
        // use hardcoded .eth namehash
        bytes32 nodehash = keccak256(abi.encodePacked(MON_NODE, label));
        Resolver resolver = Resolver(resolverAddress);
        resolver.multicallWithNodeCheck(nodehash, data);
    }

    function _setReverseRecord(
        string memory name,
        address resolver,
        address owner
    ) internal {
        
        reverseRegistrar.setNameForAddr(
            msg.sender,
            owner,
            resolver,
            string.concat(name, ".mon")
        );
    } 
}