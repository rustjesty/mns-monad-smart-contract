// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

contract PythStructs {
    struct Price { 
        uint256 price; 
        uint64 conf; 
        int32 expo; 
        uint publishTime;
    }  
}