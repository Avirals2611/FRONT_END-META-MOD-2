// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract StorageAndMemory {
    // Storage variables
    address public owner;
    uint public storedData;

    constructor() {
        owner = msg.sender;
        storedData = 0;
    }

    function updateStoredData(uint _newData) public {
        // Memory variable
        uint memoryData = _newData * 2;
        storedData = memoryData;
    }

    function multiply(uint a, uint b) public pure returns (uint) {
        // Memory variable
        uint result = a * b;
        return result;
    }

    function getStoredData() public view returns (uint) {
        return storedData;
    }
}

