import { useState,useEffect } from 'react'
import { ethers } from 'ethers'
import  crowdfundingABI from "./abi/crowdfundingABI.json";
import { Navbar } from './component/Navbar';
import CreateCampaign from './component/Createcamp';
import CampaignCard from './component/Campaigncard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CampaignPage } from './pages/CampaignPage';

// import { LoadCampaign } from './component/LoadCampaign';

const CONTRACT_ADDRESS ="0xe0e9cb2ea08a2ab99ec2e6a27d34545c967774c2"

function App() {
  const [account , setAccount] = useState(null);
  const [campaigns,setCampaigns]=useState([]);
  const [contract, setContract] = useState(null);
  const [newCampaign,setNewCampaign]=useState({title:"",description:"",goal:0});
  const [balance, setBalance] = useState("0");
  const [ensName,setEnsName]=useState(null);

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          fetchBalance(accounts[0]); // Update account
          connectWallet(); // Reconnect with new account
        } else {
          setAccount(null);
          setBalance("0");
          setEnsName("no ens available");
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // Reload on network change
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
        window.ethereum.removeListener("chainChanged", () =>
          window.location.reload()
        );
      }
    };
  }, []);

  const connectWallet=async()=>
  {
    if(window.ethereum)
    {
      try{
        const provider =new ethers.BrowserProvider(window.ethereum);
        const signer=await provider.getSigner();
        const address=await signer.getAddress(); 
        console.log(address);
        setAccount(address);
        fetchBalance(address);

        const crowdfundingContract=new ethers.Contract(CONTRACT_ADDRESS,crowdfundingABI,signer);
        setContract(crowdfundingContract);
        loadCampaigns(crowdfundingContract);

      }
      catch(error)
      {
        console.log("user deneid account access",error);
      }
    }
    else{
      alert("metamask not detected");
    }
  };
  const fetchBalance=async(address)=>
  {
    try{
      const provider =new ethers.BrowserProvider(window.ethereum);
      const balance=await provider.getBalance(address);
      console.log(ensName);
      setBalance(ethers.formatEther(balance));
      const name=await provider.lookupAddress(address);
            setEnsName(name);

    }
catch(error)
{
  console.log("Error fetching balance or ENS name:",error);
}
  };
  // const contract=crowdfundingContract;
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
  

    const createCampaign=async(newCampaign)=>{
      if(!contract) return;
      const goalInWei=ethers.parseEther(newCampaign.goal);
      console.log(goalInWei);
      try{
        const tx=await contract.createCampaign(newCampaign.title,newCampaign.description,goalInWei);
        await tx.wait();
        loadCampaigns(contract);
        setNewCampaign({title:"",description:"",goal:0});
        }
        catch(error)
        {
          console.log("error",error);
          }
          };

      const fundCampaign=async(campaignId,amount)=>
      {
    
        if(!contract){
          console.log("Contract not found");
          return;
        } 
        try{
          console.log(campaignId);
          const amountInWei=ethers.parseEther(amount);
          const tx=await contract.fund(campaignId,{value:amountInWei});
          await tx.wait();
          loadCampaigns(contract);
          console.log(`Campaign ${campaignId} funded successfully wirh ${amount} ETH`);
          }
          catch(error)
          {
            console.log("error",error);
            }
            };

        const withdrawFunds=async(campaignId)=>
        {
          if(!contract||!account)
          {
            console.log("contract or account not found in withdraw");
            return;
          }
          try{
            const campaign=campaigns[campaignId];
            if(campaign.creator.toLowerCase()!==account.toLowerCase())
            {
              alert("only the campaign creator can withdraw funds");
              return;
            }
            const tx=await contract.withdraw(campaignId);
            await tx.wait();
            loadCampaigns(contract);
            console.log(`Campaign ${campaignId} withdraw successfully`);
          }
          catch(error)
          {
            console.error("Withdrawal error:",error);
          }
        }
        const approveMilestone = async (campaignId, milestoneIndex) => {
          const contract = await ethers.getEthereumContract();
          if (!contract) return;
        
          try {
            const tx = await contract.approveMilestone(campaignId, milestoneIndex);
            await tx.wait();
            alert("Milestone approved!");
          } catch (error) {
            console.error("Error approving milestone:", error);
          }
        };
        
        ;
    
  return (
    <Router>
   <div>
    <div className='w-[210vh] border border-red-600'><Navbar account={account} connectWallet={connectWallet} balance={balance}/></div>
   <Routes>
    {/*create cmpaign*/}
    <Route path='/' element={
      <div>
      {account?<CreateCampaign createCampaign={createCampaign}/>:<p>connect wallet to Create Campaign</p>}
      </div>
    }/>
   <Route path='/campaigns' element={<CampaignPage campaigns={campaigns} fundCampaign={fundCampaign} withdrawFunds={withdrawFunds}/>}/>
  </Routes>
   </div>
   </Router>
  );
}

export default App
