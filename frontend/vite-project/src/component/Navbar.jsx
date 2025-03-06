// import React from 'react'
// import App from '../App';
// import CampaignCard from "./Campaigncard";
import { Link } from "react-router-dom";
export const Navbar = ({account,connectWallet,balance}) => {

    return (
        <nav className="bg-black text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blockfund</h1>
            
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/campaigns" className="hover:underline">Campaigns</Link>
            <Link to="/" className="hover:underline">About</Link>
          </div>
          <div>
            {account ? (
                <div>
              <p className="bg-gray-800 text-white px-3 py-1 rounded">{account.slice(0, 10)}...{account.slice(-10)}</p>
              <p>Balance:{balance}</p>
              </div>
            ) : (
                <div className='bg-black text-green-400'>
              <button 
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              </div>
            )}
          </div>
        </nav>
      );
    };
  

