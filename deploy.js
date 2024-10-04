const hre = require("hardhat");

async function main() {
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Set initial balance for the contract
  const initBalance = 1;

  // Get the contract factory and deploy the contract with the initial balance
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance);  // Pass the initial balance here
  await assessment.deployed();  // Wait for the contract to be deployed

  // Log the contract address and initial balance
  console.log(`Assessment contract with initial balance of ${initBalance} ETH deployed to: ${assessment.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
