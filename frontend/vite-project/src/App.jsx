import { useState,useEffect } from 'react'
import { ethers } from 'ethers'
import  crowdfundingABI from "./abi/crowdfundingABI.json";

const CONTRACT_ADDRESS ="0xbca9e141bca2d349f3f5cf979b7092d76abda0da";

function App() {
  const [account , setAccount] = useState(null);
  const [campaigns,setCampaigns]=useState([]);
  const [contract, setContract] = useState(null);
  const [newCampaign,setNewCampaign]=useState({title:"",description:"",goal:0});

  useEffect(()=>{
    if(window.ethereum){
    connectWallet(); 
    window.ethereum.on("chainChanged", (chainId) => {
      console.log("Network changed:", chainId);
      window.location.reload(); // Refresh on network change
    });   
    }

  },[]);
  const connectWallet=async()=>
  {
    if(window.ethereum)
    {
      try{
        const provider =new ethers.BrowserProvider(window.ethereum);
        const signer=await provider.getSigner();
        const address=await signer.getAddress(); 
        setAccount(address);

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
  

    const createCampaign=async()=>{
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
        if(!contract) return ;
        const amountInWei=ethers.parseEther(amount);
        try{
          const tx=await contract.fundCampaign(campaignId,amountInWei);
          await tx.wait();
          loadCampaigns(contract);
          }
          catch(error)
          {
            console.log("error",error);
            }
            };
    
  return (
   <div>
    <h1>Blockchain crowdFunding</h1>
    {!account?(
      <button onClick={connectWallet}>Connect Wallet</button>
    ):(
        <div>
      <p>Connnected:{account}</p>
      </div>
    )}
    {/*create cmpaign*/}
    <div>
      <h2>create a campaign</h2>
      <input type="text" placeholder='title' value={newCampaign.title} onChange={(e)=>setNewCampaign({...newCampaign,title:e.target.value})} />
      <input type="text" placeholder='description' value={newCampaign.description} onChange={(
        e)=>setNewCampaign({...newCampaign,description:e.target.value})} />
        <input type="number" placeholder='goal' value={newCampaign.goal} onChange={(
          e)=>setNewCampaign({...newCampaign,goal:e.target.value})} />
          <button onClick={createCampaign}>Create Campaign</button>

    </div>
    <h2>Active Campaigns</h2>
  
    <div>
      {campaigns.length===0?(
        <p>No campaigns . create one</p>
      )
    :
    (
      campaigns.map((campaign,index)=>(
        <div key={index}>
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
          <p>Goal:{campaign.goal}</p>
          <p>Balance:{campaign.balance}</p>
          <p>Address:{campaign.address}</p>
          {!campaign.completed &&(
            <div>
              <input type="text" placeholder='Amount(ETH)'  id={`fundAmount ${index}`}/>
              <button onClick={()=>fundCampaign(index,document.getElementById(`fundAmount${index}`).value)}>Fund</button>
            </div>
          )
          }
          </div>
      ))
    )}
    </div>
    <div>
    {campaigns.length===0?(
      <p>No campaigns</p>
    ):
    (
      campaigns.map((campaign,index)=>
      (
 <div key={index}>
  <p>{campaign.name}</p>
  <p>Goal:{campaign.goal} ETH</p>
  <button>fund</button>
</div>
      ))
    )
    }
    </div>
   </div>
  );
}

export default App
