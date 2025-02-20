// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IExtendedDNSResolver.sol";
import "./interfaces/IAddressResolver.sol";
import "./interfaces/IAddrResolver.sol";
import "../../utils/HexUtils.sol";

contract ExtendedDNSResolver is IExtendedDNSResolver, IERC165 {
    using HexUtils for *;

    uint256 private constant COIN_TYPE_ETH = 60;

    error NotImplemented();
    error InvalidAddressFormat();

    function supportsInterface(
        bytes4 interfaceId
    ) external view virtual override returns (bool) {
        return interfaceId == type(IExtendedDNSResolver).interfaceId;
    }

    function resolve(
        bytes calldata /* name */,
        bytes calldata data,
        bytes calldata context
    ) external pure override returns (bytes memory) {
        bytes4 selector = bytes4(data);
        if (
            selector == IAddrResolver.addr.selector ||
            selector == IAddressResolver.addr.selector
        ) {
            if (selector == IAddressResolver.addr.selector) {
                (, uint256 coinType) = abi.decode(data[4:], (bytes32, uint256));
                if (coinType != COIN_TYPE_ETH) return abi.encode("");
            }
            (address record, bool valid) = context.hexToAddress(
                2,
                context.length
            );
            if (!valid) revert InvalidAddressFormat();
            return abi.encode(record);
        }
        revert NotImplemented();
    }
}