import React, { useState } from "react";
import { use } from "react";

const CampaignCard = ({ campaign, index, fundCampaign ,withdrawFunds ,account}) => {
    console.log(`index: ${index}`);
    const [amount,setAmount]=useState("");
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
      <p className="text-gray-600 mt-2">{campaign.description}</p>
      <p className="text-gray-700 font-semibold mt-2">🎯 Goal: {campaign.goal} ETH</p>
      <p className="text-gray-700">💰 Balance: {campaign.balance} ETH</p>
      <p className="text-gray-500 text-sm">📍 Address: {campaign.creator.slice(0,6)}...{campaign.creator.slice(-4)}</p>
      <p>{campaign.completed?"Goal is meet":"not completed"}</p>

      {!campaign.completed && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => fundCampaign(index,amount)}
            className="mt-2 w-full bg-black text-green-500 py-2 rounded-md border border-green-500 hover:bg-gray-900 hover:text-green-400 transition duration-300"
          >
            Fund Campaign
          </button>
        </div>
      )}
      {campaign.completed ? (
        <p className="text-green-500 font-bold mt-4">Campaign completed!</p>
      ) : parseFloat(campaign.balance) >= parseFloat(campaign.goal) ? (
        <button
          onClick={() => withdrawFunds(index)}
          className="mt-2 w-full bg-blue-500 text-green-400 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Withdraw Funds
        </button>
      ) : null}
    </div>
  );
};

export default CampaignCard;
