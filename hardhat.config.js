require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
console.log(process.env.PRIVATE_KEY);
console.log(process.env.ZETASCAN_API_KEY);
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    Sepolia: {
      url: process.env.ZETASCAN_API_KEY, // Zetachain RPC URL
      accounts: [process.env.PRIVATE_KEY], // Private key from .env file
     // Zetachain Testnet Chain ID
    },
  },
  zetascan: {
    apiKey: process.env.ZETASCAN_API_KEY,
  },
};
