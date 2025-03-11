// const hre=require("hardhat");
const {ethers}=require("hardhat");
async function main() {
    // const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const[deployer] =await ethers.getSigners();
    console.log(`Deploying contract with account: ${deployer.address}`);
    const Crowdfunding=await ethers.getContractFactory("Crowdfunding");
    const crowdfunding=await Crowdfunding.deploy();
//    await crowdfunding.deployed();
    await crowdfunding.deployed();
    console.log("Contract deployed to:"+await crowdfunding.target);
}
main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
    });
