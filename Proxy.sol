// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyContract {
    address public owner;
    uint public count;

    constructor() {
        owner = msg.sender;
        count = 0;
    }

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}


//Proxy Contract:

contract UpgradeableProxy {
    address public implementation;
    address public owner;

    constructor(address _implementation) {
        implementation = _implementation;
        owner = msg.sender;
    }

    fallback() external {
        (bool success, ) = implementation.delegatecall(msg.data);
        require(success, "Call failed");
    }

    function upgrade(address newImplementation) public {
        require(msg.sender == owner, "Only owner can upgrade");
        implementation = newImplementation;
    }
}

