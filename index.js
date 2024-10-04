import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessment_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import styles from "./styles.module.css";

export default function HomePage() {
  const bg = "https://picsum.photos/1920/1080";

  useEffect(() => {
    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.color = "white";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.textAlign = "center";
    document.body.style.paddingTop = "50px";
  }, []);

  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [assessment, setAssessment] = useState(undefined);
  const [stockCount, setStockCount] = useState(0);
  const [message, setMessageState] = useState("Welcome to this Stock Market Exchange");
  const [loadingStockCount, setLoadingStockCount] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const [selectedStock, setSelectedStock] = useState("NIFTY50");

  const contractAddress = "0xdd2fd4581271e230360230f9337d5c0430bf44c0";
  const assessmentABI = assessment_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      console.log("Ethereum wallet found");
    } else {
      console.log("No Ethereum wallet found");
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getAssessmentContract();
  };

  const getAssessmentContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const assessmentContract = new ethers.Contract(contractAddress, assessmentABI, signer);

    console.log("Assessment contract initialized:", assessmentContract);
    setAssessment(assessmentContract);
  };

  const fetchStockCount = async () => {
    if (assessment) {
      try {
        setLoadingStockCount(true);
        console.log("Fetching stock count...");
        const count = await assessment.getStockCount(); // Ensure this function is correctly implemented in the smart contract
        setStockCount(count.toNumber());
        console.log("Fetched stock count:", count.toNumber());
      } catch (error) {
        console.error("Error fetching stock count:", error);
      } finally {
        setLoadingStockCount(false);
      }
    }
  };

  const fetchMessage = async () => {
    if (assessment) {
      try {
        setLoadingMessage(true);
        console.log("Fetching message...");
        const message = await assessment.getMessage();
        setMessageState(message);
        console.log("Fetched message:", message);
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setLoadingMessage(false);
      }
    }
  };

  const buyStocks = async () => {
    if (assessment) {
      const stockAmount = prompt(`Enter the number of ${selectedStock} stocks to buy:`);
      if (stockAmount) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          await provider.send("eth_requestAccounts", []);

          const assessmentWithSigner = assessment.connect(signer);

          console.log(`Sending transaction to buy ${stockAmount} ${selectedStock} stocks...`);
          const tx = await assessmentWithSigner.buyStocks(Number(stockAmount), { gasLimit: 100000 });
          
          setStockCount(stockAmount);
          setMessageState(`You have successfully bought ${stockAmount} stocks of ${selectedStock}. Your total stocks now: ${stockAmount}.`);  // Use the updated count directly
          await tx.wait();

        } catch (error) {
          console.error("Error buying stocks:", error);
        }
      }
    } else {
      console.error("Assessment contract is not defined.");
      alert("The assessment contract is not available. Please try again later.");
    }
  };

  const sellStocks = async () => {
    if (assessment) {
      const stockAmount = Number(prompt(`Enter the number of ${selectedStock} stocks to sell:`));
      if (stockAmount) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          await provider.send("eth_requestAccounts", []);

          console.log('stock_amount:',stockAmount,stockCount);

          const assessmentWithSigner = assessment.connect(signer);
          console.log(`Sending transaction to sell ${stockAmount} ${selectedStock} stocks...`);
          const tx = await assessmentWithSigner.sellStocks(Number(stockAmount), { gasLimit: 100000 });
          const remaining = stockAmount > stockCount? 0 : (stockCount - stockAmount);
          setStockCount(remaining)
          setMessageState(`You have successfully sold ${stockAmount} stocks of ${selectedStock}. Your total stocks now: ${remaining}.`);  // Use the updated count directly

          await tx.wait();

          console.log("Stocks sold, fetching new stock count...");

          // Fetch updated stock count after the transaction
          const updatedStockCount = await assessment.getStockCount();
          const newStockCount = updatedStockCount.toNumber();
          
          // Update the state
          setStockCount(newStockCount);

          setMessageState(`You have successfully sold ${stockAmount} stocks of ${selectedStock}. Your total stocks now: ${remaining}.`);  // Use the updated count directly
        } catch (error) {
          console.error("Error selling stocks:", error);
        }
      }
    } else {
      console.error("Assessment contract is not defined.");
      alert("The assessment contract is not available. Please try again later.");
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this application.</p>;
    }

    if (!account) {
      return <button className={styles.btn} onClick={connectAccount}>Connect your MetaMask wallet</button>;
    }

    return (
      <div className={styles.card}>
        <p><strong>Transaction Account:</strong> {account}</p>
        <p><strong>Total Stock count:</strong> {loadingStockCount ? "Loading..." : stockCount !== undefined ? stockCount : "Not available"}</p>
        
        <div>
          <p><strong>Select which Stock you want to buy/sell:</strong></p>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="stock" 
                value="Microsoft" 
                checked={selectedStock === "Microsoft"}
                onChange={() => setSelectedStock("Microsoft")}
              />
              Microsoft
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="stock" 
                value="Tesla" 
                checked={selectedStock === "Tesla"}
                onChange={() => setSelectedStock("Tesla")}
              />
              Tesla
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input 
                type="radio" 
                name="stock" 
                value="Google" 
                checked={selectedStock === "Google"}
                onChange={() => setSelectedStock("Google")}
              />
              Google
            </label>
          </div>
        </div>

        <button className={styles.btn} onClick={buyStocks}>Buy Stock(s)</button>
        <button className={styles.btn} onClick={sellStocks}>Sell Stock(s)</button>
        <p><strong>Confirmation Message:</strong> {loadingMessage ? "Loading..." : message !== undefined ? message : "Not available"}</p>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (account && assessment) {
      console.log("Fetching initial values...");
      fetchStockCount();
      fetchMessage();
    }
  }, [account, assessment]);

  return (
    <main className={styles.container}>
      <header><h1>Welcome to the Stock Market DApp</h1></header>
      {initUser()}
    </main>
  );
}
