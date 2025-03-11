
import CampaignCard from '../component/Campaigncard'

export const CampaignPage = ({campaigns,fundCampaign,withdrawFunds,account,Refund}) => {
  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold text-center mb-6">Active Campaigns</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.length === 0 ? (
        <p className="text-red-500 text-center">No campaigns available. Create one!</p>
      ) : (
        campaigns.map((campaign, index) => (
          <CampaignCard key={index} campaign={campaign} index={index} fundCampaign={fundCampaign} withdrawFunds={withdrawFunds} account={account} Refund={Refund}/>
        ))
      )}
    </div>
  </div>
  );
};
