
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

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

    }
    Campaign [] public campaigns;

    event CampaignCreated(uint256 CampaignId,address creator,string title,uint256 goal);
    event Funded(uint256 campaignId,address funder, uint256 amount);
    event Withdrawn(uint256 CampaignId,address creator,uint256 amount);

    function createCampaign(string memory _title, string memory _description, uint256 _goal) public
    {
        // require(_goal>0,"Goal must be greater than 0");
        campaigns.push(Campaign(msg.sender,_title,_description,_goal,0,false));
        emit CampaignCreated(campaigns.length-1,msg.sender,_title,_goal);
    }
    function fund(uint256 _campaignId) public payable {
        require(_campaignId>=0 && _campaignId<campaigns.length,"Invalid campaign");
        Campaign storage campaign = campaigns[_campaignId];
        // require(msg.value>0,"Amount must be greater than 0");
        require(!campaign.completed,"Campaign already completed");
        campaign.amountRaised += msg.value;
        emit Funded(_campaignId,msg.sender,msg.value);
        }

    function withdraw(uint256 _campaignId) payable public {
        require(_campaignId>=0 && _campaignId<campaigns.length,"Invalid campaign");
        Campaign storage campaign = campaigns[_campaignId];
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
             creators = new address[](campaigns.length);
         titles = new string[](campaigns.length);
         descriptions = new string[](campaigns.length);
             goals = new uint256[](campaigns.length);
             amountRaised = new uint256[](campaigns.length);
 completed = new bool[](campaigns.length);
            for (uint256 i = 0; i < campaigns.length; i++) {
                creators[i] = campaigns[i].creator;
                titles[i] = campaigns[i].title;
                descriptions[i] = campaigns[i].description;
                goals[i] = campaigns[i].goal;
                amountRaised[i] = campaigns[i].amountRaised;
                completed[i] = campaigns[i].completed;
            }
            return (creators,titles,descriptions,goals,amountRaised,completed);
        }
}