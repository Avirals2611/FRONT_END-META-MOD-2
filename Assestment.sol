// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    address public owner;
    uint256 private stockCount;
    string private message;

    event StockTransaction(address indexed user, string action, uint256 amount);
    event MessageSet(string newMessage);

    constructor(uint256 initialStockCount) {
        owner = msg.sender;  // Set the contract deployer as the owner
        stockCount = initialStockCount;
    }

    // Modifier to restrict actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Function to get the current stock count
    function getValue() public view returns (uint256) {
        return stockCount;
    }

    // Function to get the current message
    function getMessage() public view returns (string memory) {
        return message;
    }

    // Function to buy stocks (increments the stock count)
    function buyStocks(uint256 amount) public onlyOwner {
        require(amount > 0, "Stock amount must be greater than zero");
        stockCount += amount;
        emit StockTransaction(msg.sender, "buy", amount);
    }

    // Function to sell stocks (decrements the stock count)
    function sellStocks(uint256 amount) public onlyOwner {
        require(stockCount >= amount, "Not enough stocks to sell");
        require(amount > 0, "Stock amount must be greater than zero");
        stockCount -= amount;
        emit StockTransaction(msg.sender, "sell", amount);
    }

    // Function to set a message
    function setMessage(string memory newMessage) public onlyOwner {
        message = newMessage;
        emit MessageSet(newMessage);
    }
}
