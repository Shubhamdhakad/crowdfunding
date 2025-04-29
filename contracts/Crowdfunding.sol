
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.20;

contract Crowdfunding {
    constructor() {
        
    }
    struct Campaign{
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 amountRaised;
        ///uint256 deadline;
        bool completed;
        // string ipfsHash;
   mapping(address=>uint256) contributions;
    }
    mapping (uint256 => Campaign) public Campaigns;
    uint256 public CampaignCount=0;

    event CampaignCreated(uint256 CampaignId,address creator,string title,uint256 goal);
    event Funded(uint256 campaignId,address funder, uint256 amount);
    event Withdrawn(uint256 CampaignId,address creator,uint256 amount);
     event Refunded(uint256 campaignId,address funder,uint256 amount);
    function createCampaign(string memory _title, string memory _description, uint256 _goal) public
    {
        require(_goal>0,"Goal must be greater than 0");

        Campaign storage newCampaign = Campaigns[CampaignCount];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.amountRaised = 0;
        newCampaign.completed = false;
        emit CampaignCreated(CampaignCount,msg.sender,_title,_goal);
        CampaignCount++;
    }
    function fund(uint256 _campaignId) public payable {
        require(_campaignId>=0 && _campaignId<CampaignCount,"Invalid campaign");
        Campaign storage campaign = Campaigns[_campaignId];
        // require(msg.value>0,"Amount must be greater than 0");
        require(!campaign.completed,"Campaign already completed");
        campaign.amountRaised += msg.value;
        campaign.contributions[msg.sender] += msg.value;
        // campaign.contributions[msg.sender] += msg.value;
        emit Funded(_campaignId,msg.sender,msg.value);
        }

    function withdraw(uint256 _campaignId) payable public {
        require(_campaignId>=0 && _campaignId<CampaignCount,"Invalid campaign");
        Campaign storage campaign = Campaigns[_campaignId];
        require(campaign.amountRaised>=campaign.goal,"Goal not met");
        require(msg.sender==campaign.creator,"Only the creator can withdraw");
        require(!campaign.completed,"Campaign already completed");
        uint256 contractBalance = address(this).balance;
    require(contractBalance >= campaign.amountRaised, "Insufficient contract balance");

        campaign.completed = true;
        payable(campaign.creator).transfer(campaign.amountRaised);
        emit Withdrawn(_campaignId,campaign.creator,campaign.amountRaised);
        }
        function getCampaign() public view returns (address[] memory creators,string[] memory titles,
        string[] memory descriptions,uint256[] memory goals,uint256[] memory amountRaised, bool[] memory completed) {
             creators = new address[](CampaignCount);
         titles = new string[](CampaignCount);
         descriptions = new string[](CampaignCount);
             goals = new uint256[](CampaignCount);
             amountRaised = new uint256[](CampaignCount);
 completed = new bool[](CampaignCount);
            for (uint256 i = 0; i < CampaignCount; i++) {
                creators[i] = Campaigns[i].creator;
                titles[i] = Campaigns[i].title;
                descriptions[i] = Campaigns[i].description;
                goals[i] = Campaigns[i].goal;
                amountRaised[i] = Campaigns[i].amountRaised;
                completed[i] = Campaigns[i].completed;
            }
            return (creators,titles,descriptions,goals,amountRaised,completed);
        }

    function refund(uint256 _campaignId) public{
        require(_campaignId>=0 && _campaignId<CampaignCount,"Invalid campaign");
        Campaign storage campaign = Campaigns[_campaignId];
        // require(campaign.amountRaised<campaign.goal,"Goal met , no refunds");
        require(campaign.contributions[msg.sender]>0,"No contribution");

        uint256 amountToRefund=campaign.contributions[msg.sender];
        campaign.contributions[msg.sender]=0;
        campaign.amountRaised-=amountToRefund;
        payable(msg.sender).transfer(amountToRefund);
        emit Refunded(_campaignId,msg.sender,amountToRefund);
    }
    function getcontractBal() public  view returns(uint256)
    {
        return address(this).balance/1e18;
    }
}