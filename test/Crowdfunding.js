const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Crowdfunding Contract", function () {
    async function deployFixture() {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();
        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        const crowdfunding = await Crowdfunding.deploy();
        return { crowdfunding, owner, addr1, addr2, addr3 };
    }

    it("Should create a campaign", async function () {
        const { crowdfunding, owner } = await loadFixture(deployFixture);
        await expect(crowdfunding.createCampaign("Test Campaign", "Description", 100))
            .to.emit(crowdfunding, "CampaignCreated")
            .withArgs(0, owner.address, "Test Campaign", 100);
    });

    it("Should allow funding a campaign", async function () {
        const { crowdfunding, addr1 } = await loadFixture(deployFixture);
        await crowdfunding.createCampaign("Test Campaign", "Description", 100);
        await expect(crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("1") }))
            .to.emit(crowdfunding, "Funded")
            .withArgs(0, addr1.address, ethers.parseEther("1"));
    });

    it("Should prevent withdrawing before goal is met", async function () {
        const { crowdfunding, owner, addr1 } = await loadFixture(deployFixture);
        await crowdfunding.createCampaign("Test Campaign", "Description", ethers.parseEther("2"));
        await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("1") });
        
        await expect(crowdfunding.connect(owner).withdraw(0)).to.be.revertedWith("Goal not met");
    });

    it("Should allow withdrawing funds after goal is met", async function () {
        const { crowdfunding, owner, addr1 } = await loadFixture(deployFixture);
        await crowdfunding.createCampaign("Test Campaign", "Description", ethers.parseEther("2"));
        await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("2") });
        
        await expect(crowdfunding.connect(owner).withdraw(0)).to.emit(crowdfunding, "Withdrawn");
    });

    it("Should not allow non-owner to withdraw funds", async function () {
        const { crowdfunding, addr1, addr2 } = await loadFixture(deployFixture);
        await crowdfunding.createCampaign("Test Campaign", "Description", ethers.parseEther("2"));
        await crowdfunding.connect(addr1).fund(0, { value: ethers.parseEther("2") });
        
        await expect(crowdfunding.connect(addr2).withdraw(0)).to.be.revertedWith("Only the creator can withdraw");
    });

    

   
   
   
   });
