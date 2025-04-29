const hre = require("hardhat");

async function main() {
    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const contract = await Crowdfunding.deploy(); // Deploy contract

    await contract.waitForDeployment(); // ✅ Correct method instead of deployed()

    console.log(`Contract deployed to:${await contract.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});