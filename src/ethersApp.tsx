import { formatEther, formatUnits, JsonRpcSigner } from "ethers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { TOKEN_ABI, TOKEN_ADDRESS } from "./Token";

export default function EthersApp() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.0");
  const [events, setEvents] = useState<any>([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);

        const address = await (await web3Signer).getAddress();
        setUserAddress(address);
        await getBalance(address, web3Provider);
      } catch (error) {
        console.error("User rejected the request.", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this DApp.");
      console.error("MetaMask is not installed.");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
  };

  const getBalance = async (
    address: string,
    web3Provider: ethers.BrowserProvider
  ) => {
    if (web3Provider) {
      try {
        const contract = new ethers.Contract(
          TOKEN_ADDRESS,
          TOKEN_ABI,
          web3Provider
        );
        const balance = await contract.balanceOf(address);
        console.log(balance);
        setBalance(formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const mintTokens = async () => {
    if (signer && userAddress && provider) {
      try {

        const toAddress = prompt('Input the target address');
        if(!toAddress) return;

        const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        const amount = ethers.parseUnits("100.0", 18);

        const tx = await contract.mint(toAddress, amount);
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        console.log("Minting complete!");
        getBalance(userAddress, provider);
      } catch (error) {
        console.error("Error minting tokens:", error);
      }
    } else {
      alert("Please connect your wallet first.");
    }
  };


  const transferTokens = async () => {
    if (signer && userAddress && provider) {
      try {

        const toAddress = prompt('Input the target address');
        if(!toAddress) return;

        const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        const amount = ethers.parseUnits("100.0", 18);

        const tx = await contract.transfer(toAddress, amount);
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        getBalance(userAddress, provider);
      } catch (error) {
        console.error("Error transfering tokens:", error);
      }
    } else {
      alert("Please connect your wallet first.");
    }
  };

  useEffect(() => {
    if (provider) {
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
      console.log("Setting up event listeners...");

      contract.on("Transfer", (_from, _to, _amount, event) => {
        const amount = formatEther(_amount);
        console.log(`${ _from } => ${ _to }: ${ amount }`);
      
        // The `event.log` has the entire EventLog
      
        // Optionally, stop listening
        event.removeListener();
      });
      
      // Clean up the event listener on component unmount
      return () => {
        contract.removeAllListeners("Transfer");
      };
    }
  }, [provider]);

  return (
    <>
      <p>Built by Ethers.js</p>
      <p>{userAddress ?? ""}</p>
      {userAddress && <p>Balance: {balance}</p>}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={!userAddress ? connectWallet : disconnectWallet}>
          {!userAddress ? "Connect" : "Disconnect"} wallet
        </button>

        {userAddress && <button onClick={mintTokens}>Mint 100 MHTs</button>}
        {userAddress && <button onClick={transferTokens}>Transfer 100 MHTs</button>}


      </div>
    </>
  );
}
