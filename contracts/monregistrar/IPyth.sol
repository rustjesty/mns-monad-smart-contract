// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;
import "./PythStructs.sol";

interface IPyth {
    function getPrice(
        bytes32 id
    ) external view returns (PythStructs.Price memory price);

    function getPriceUnsafe(
        bytes32 id
    ) external view returns (PythStructs.Price memory price);
}