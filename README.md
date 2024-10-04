# Stock Market Dapp

## Setup Instructions

1. **Open in Gitpod**: Click on [Open in Gitpod](https://metacrafterc-scmstarter-ybypmhi93f4.ws-us115.gitpod.io/) to start the project in Gitpod.

2. **Install Prerequisites**: Make sure you have `hardhat` and `node` installed in your Gitpod environment.

3. **Open Terminals**:
   - Open three terminals in your Gitpod workspace.

## Terminal Commands

### Terminal 2: Start Hardhat Node
'''bash
This command starts a local Ethereum-like network using Hardhat.

### Terminal 3: Deploy Smart Contract
'''bash
npx hardhat run scripts/deploy.js --network localhost

### After deployment, note the contract address displayed (0x....45). Copy this address.

Update index.js
Paste the copied contract address into the contractAddress variable in index.js.

Run the Project
Terminal 1: Start Development Server
bash
Copy code
npm run dev
This command starts the project on port 3000.

### Interacting with Project
Front View of my Stock Market Dapp

![meta3](https://github.com/user-attachments/assets/cb39d3e8-7853-489b-ad22-ef947f250a71)

Interacting with UI and confirming the transaction with Metamask

![meta5](https://github.com/user-attachments/assets/2a6f0439-8305-4910-ab47-f165d7def37c)

Final update of the transaction and also confirmation message

![meta2](https://github.com/user-attachments/assets/25a6479d-9ee2-4e84-b534-d736f7b1afbe)

### Author

Aayush Tewari

Mail-id: taayush1912@gmail.com

Chandigarh University

