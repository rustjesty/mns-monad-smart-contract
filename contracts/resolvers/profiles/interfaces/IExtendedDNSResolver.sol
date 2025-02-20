// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IExtendedDNSResolver {
    function resolve(
        bytes memory name,
        bytes memory data,
        bytes memory context
    ) external view returns (bytes memory);
}