// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IPriceOracle {
    struct Price {
        uint256 base;
        uint256 premium;
    }

    /**
     * @dev Returns the price to register or renew a name.
     * @param name The name being registered or renewed. 
     * @param duration How long the name is being registered or extended for, in seconds.
     * @return base premium tuple of base price + premium price
     */
    function price(
        string calldata name, 
        uint256 duration
    ) external view returns (Price calldata);
}