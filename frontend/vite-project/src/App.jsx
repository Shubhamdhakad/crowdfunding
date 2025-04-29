import { useState, useEffect } from "react";
import { ethers } from "ethers";
import crowdfundingABI from "./abi/crowdfundingABI.json";
import { Navbar } from "./component/Navbar";
import CreateCampaign from "./component/Createcamp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CampaignPage } from "./pages/CampaignPage";
// import { Withdraw } from "./component/Withdraw";
import { SearchBar } from "./component/SearchBar";

const CONTRACT_ADDRESS = "0xbc04d5292d14968598359b841f665b5e59027cc2";

function App() {
  const [account, setAccount] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [ensName, setEnsName] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]);
        } else {
          setAccount(null);
          setBalance("0");
          setEnsName(null);
        }
      });

      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
        window.ethereum.removeListener("chainChanged", window.location.reload);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      fetchBalance(address);

      const crowdfundingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        crowdfundingABI,
        signer
      );
      setContract(crowdfundingContract);
      loadCampaigns(crowdfundingContract);
    } catch (error) {
      console.log("User denied account access", error);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      // const name = await provider.lookupAddress(address);
       const bal=ethers.formatUnits(balance,18);
       console.log(bal);
      setBalance(Math.round(bal * 100000) / 100000);
      // setEnsName(name);
    } catch (error) {
      console.log("Error fetching balance or ENS name:", error);
    }
  };

  const loadCampaigns = async (contract) => {
    try {
      const campaignsData = await contract.getCampaign();
      const formattedCampaigns = campaignsData[0].map((_, i) => ({
        creator: campaignsData[0][i],
        title: campaignsData[1][i],
        description: campaignsData[2][i],
        goal: ethers.formatEther(campaignsData[3][i]),
        balance: ethers.formatEther(campaignsData[4][i]),
        completed: campaignsData[5][i],
      }));
      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    }
  };

  const createCampaign = async (newCampaign) => {
    if (!contract) return;
    try {
      const goalInWei = ethers.parseEther(newCampaign.goal);
      const tx = await contract.createCampaign(
        newCampaign.title,
        newCampaign.description,
        goalInWei
      );
      await tx.wait();
      loadCampaigns(contract);
    } catch (error) {
      console.log("Error creating campaign:", error);
    }
  };

  const fundCampaign = async (campaignId, amount) => {
    if (!contract) return console.log("Contract not found");
    try {
      const amountInWei = ethers.parseEther(amount);
      const tx = await contract.fund(campaignId, { value: amountInWei });
      await tx.wait();
      loadCampaigns(contract);
      console.log(`Campaign ${campaignId} funded successfully with ${amount} ETH`);
    } catch (error) {
      console.log("Error funding campaign:", error);
    }
  };

  const withdrawFunds = async (campaignId) => {
    if (!contract || !account) return console.log("Contract or account not found");

    try {
      const campaign = campaigns[campaignId];
      if (campaign.creator.toLowerCase() !== account.toLowerCase()) {
        alert("Only the campaign creator can withdraw funds");
        return;
      }
      const tx = await contract.withdraw(campaignId);
      await tx.wait();
      loadCampaigns(contract);
      console.log(`Campaign ${campaignId} withdrawn successfully`);
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  const Refund = async (campaignId) => {
    if (!contract || !account) return console.log("Contract or account not found");

    try {
      const tx = await contract.refund(campaignId);
      await tx.wait();
      loadCampaigns(contract);
      console.log(`Campaign ${campaignId} refunded successfully`);
    } catch (error) {
      console.error("Refund error:", error);
    }
  };

  return (
    <div className="bg-amber-100 w-screen h-screen">
    <Router>
      <div className="mt-0">
        <Navbar account={account} connectWallet={connectWallet} balance={balance}/>
        <Routes>
          <Route
            path="/"
            element={account ?
              <div className=" mt-8">
             <div className=""> <CreateCampaign createCampaign={createCampaign} /></div>
              

              </div>: <p>Connect wallet to create a campaign</p>}
          />
          <Route
            path="/campaigns"
            element={<CampaignPage campaigns={campaigns} fundCampaign={fundCampaign} withdrawFunds={withdrawFunds} Refund={Refund} />}
          />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
