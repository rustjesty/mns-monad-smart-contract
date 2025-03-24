// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

contract StaticMetadataService {
    string private _uri;
    using Strings for uint256;

    constructor(string memory _metaDataUri) {
        _uri = _metaDataUri;
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        return bytes(_uri).length > 0 ? string(abi.encodePacked(_uri, tokenId.toString())) : "";
    }

    function setUri(string memory _metaDataUri) public {
        _uri = _metaDataUri;
    }
}