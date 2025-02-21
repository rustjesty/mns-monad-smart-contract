// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "./IPriceOracle.sol";

interface IMONRegistrarControllerV2 {
    function rentPrice(
        string memory,
        uint256
    ) external view returns (IPriceOracle.Price memory);

    function available(string memory) external returns (bool);
 
    function register(
        string calldata,
        address,
        uint256,
        bytes32,
        address,
        bytes[] calldata,
        bool,
        uint16
    ) external payable;

    function renew(string calldata, uint256) external payable;
}