const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding", function () {
  let Crowdfunding, crowdfunding, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
  });

  it("Should not allow creating a campaign with zero goal", async function () {
    await expect(
      crowdfunding.createCampaign("Invalid Campaign", "Zero goal", 0)
    ).to.be.revertedWith("Goal must be greater than 0");
  });

  it("Should allow multiple users to contribute to a campaign", async function () {
    await crowdfunding.createCampaign("Multi-funder", "Many people funding", ethers.parseEther("2"));

    await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("0.5") });
    await crowdfunding.connect(addr2).fund(0, { value: ethers.parseEther("0.5") });

    const campaign = await crowdfunding.Campaigns(0);
    expect(campaign.amountRaised).to.equal(ethers.parseEther("1"));
  });

  it("Should not allow a non-creator to withdraw funds", async function () {
    await crowdfunding.createCampaign("Project X", "Description X", ethers.parseEther("1"));
    await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("1") });

    await expect(crowdfunding.connect(addr1).withdraw(0))
      .to.be.revertedWith("Only the creator can withdraw");
  });

  it("Should not allow a user to refund if they didn’t contribute", async function () {
    await crowdfunding.createCampaign("Project Y", "Description Y", ethers.parseEther("1"));

    await expect(crowdfunding.connect(addr2).refund(0))
      .to.be.revertedWith("No contribution");
  });

  it("Should ensure funds remain locked if campaign is not completed", async function () {
    await crowdfunding.createCampaign("Locked Funds", "Cannot withdraw yet", ethers.parseEther("1"));
    await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("0.5") });

    const contractBalance = await ethers.provider.getBalance(crowdfunding.target);
    expect(contractBalance).to.equal(ethers.parseEther("0.5"));
  });

  it("Should prevent double withdrawals", async function () {
    await crowdfunding.createCampaign("No Double Withdraw", "Withdraw only once", ethers.parseEther("1"));
    await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("1") });

    await crowdfunding.withdraw(0);
    
    await expect(crowdfunding.withdraw(0))
      .to.be.revertedWith("Campaign already completed");
  });

//   it("Should not allow the campaign creator to refund themselves", async function () {
//     await crowdfunding.createCampaign("Creator Refund", "Creator shouldn't refund", ethers.parseEther("1"));
//     await crowdfunding.connect(owner).fund(0, { value: ethers.parseEther("0.5") });

//     await expect(crowdfunding.refund(0))
//       .to.be.revertedWith("No contribution");
//   });

  it("Should return correct details from getCampaign()", async function () {
    await crowdfunding.createCampaign("Campaign 1", "Test Desc", ethers.parseEther("1"));
    await crowdfunding.createCampaign("Campaign 2", "Another Desc", ethers.parseEther("2"));

    const result = await crowdfunding.getCampaign();
    const [creators, titles, descriptions, goals, amountRaised, completed] = result;

    expect(creators[0]).to.equal(owner.address);
    expect(titles[0]).to.equal("Campaign 1");
    expect(goals[1]).to.equal(ethers.parseEther("2"));
    expect(completed[1]).to.be.false;
  });

});
