import  { useState } from "react";
const CreateCampaign = ({ createCampaign }) => {
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    goal: "",

  });

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8 mr-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Create a Campaign
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={newCampaign.title}
          onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={newCampaign.description}
          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
        />

        <input
          type="number"
          placeholder="Goal (ETH)"
          value={newCampaign.goal}
          onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
    
 <div className="flex justify-center">
        <button
          onClick={() => createCampaign(newCampaign)}
          className=" bg-black text-green-500 px-6 py-2 rounded-lg font-semibold border border-green-500 hover:bg-gray-900 hover:text-green-400 transition duration-300"
        >
          Create Campaign
        </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
