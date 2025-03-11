// import React from 'react'
// import App from '../App';
// import CampaignCard from "./Campaigncard";
import { Link } from "react-router-dom";
import { Withdraw } from "./Withdraw";
export const Navbar = ({account,connectWallet,balance,WithdrawFunds}) => {

    return (
        <nav className="bg-black text-white p-4 flex justify-between items-center w-[215vh] h-[11vh] mt-0">
          <h1 className="text-2xl font-bold">Blockfund</h1>
                      <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/campaigns" className="hover:underline">Campaigns</Link>
            <Link to="/" className="hover:underline">About</Link>
          </div>
          <div>
            {account ? (
                <div>
              <p className="bg-gray-800 text-white px-3 py-1 rounded w-[25vh]">{account.slice(0, 6)}...{account.slice(-4)}</p>
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
  

