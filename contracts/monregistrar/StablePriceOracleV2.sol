// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "./IPyth.sol";
import "./IPriceOracle.sol";
import "./StringUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract StablePriceOracleV2 is IPriceOracle, Ownable {
    using StringUtils for *;
 
    uint256 public price1Letter;
    uint256 public price2Letter;
    uint256 public price3Letter;
    uint256 public price4Letter;
    uint256 public price5Letter;

    IPyth public immutable _priceOracle;
    bytes32 public immutable _feedId;
 
    constructor(IPyth priceOracle, bytes32 feedId, uint256[] memory prices) Ownable(msg.sender) {
        _priceOracle = priceOracle;
        _feedId = feedId;
        setPrices(prices);
    }

    function setPrices(uint256[] memory prices) public onlyOwner () {
        price1Letter = prices[0];
        price2Letter = prices[1];
        price3Letter = prices[2];
        price4Letter = prices[3];
        price5Letter = prices[4];
    }   

    function price(
        string calldata name, 
        uint256 duration
    ) external view override returns (IPriceOracle.Price memory) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5Letter * duration;
        } else if (len == 4) {
            basePrice = price4Letter * duration;
        } else if (len == 3) {
            basePrice = price3Letter * duration;
        } else if (len == 2) {
            basePrice = price2Letter * duration;
        } else {
            basePrice = price1Letter * duration;
        }

        return
            IPriceOracle.Price({
                base: attoUSDToWei(basePrice),
                premium: 0
            });
    } 

    function attoUSDToWei(uint256 amount) internal view returns (uint256) {
        PythStructs.Price memory oracle = _priceOracle.getPriceUnsafe(_feedId);
        return (amount * 1e8) / oracle.price;
    }

    function weiToAttoUSD(uint256 amount) internal view returns (uint256) {
        PythStructs.Price memory oracle = _priceOracle.getPriceUnsafe(_feedId);
        return (amount * oracle.price) / 1e8;
    }
}