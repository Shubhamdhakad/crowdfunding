import { useState } from "react";
export const SearchBar = (Campaigns) => {
    const [query, setQuery] = useState("");

    const filteredData = Campaigns.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  
    return (
      <div className="flex flex-col items-center mt-10">
        <input
          type="text"
          placeholder="Search..."
          className="w-80 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="mt-4 bg-white shadow-lg rounded-lg w-80 p-3">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <li key={index} className="p-2 border-b last:border-none">
                {item}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No results found</p>
          )}
        </ul>
      </div>
    );
};

