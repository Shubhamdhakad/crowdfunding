const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ethers } = require("ethers");
const {abi}=require("../frontend/vite-project/src/abi/crowdfundingABI.json");
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const contractAddress = "";
const contract = new ethers.Contract(contractAddress, abi, provider);

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend interaction

app.get("/", (req, res) => {
    res.send("Welcome to the Crowdfunding Backend!");
});

// Example route to get campaign details
app.get("/campaigns", (req, res) => {
    res.json({ message: "Fetch crowdfunding campaigns here." });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
