// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

interface IVersionableResolver {
    event VersionChanged(bytes32 indexed node, uint64 newVersion);

    function recordVersions(bytes32 node) external view returns (uint64);
}