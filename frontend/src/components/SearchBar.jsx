import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query); // Trigger the search with the current query
  };

  return (
    <div className="flex items-center p-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-l-md outline-none bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
      />

      <button
        onClick={handleSearch}
        className="ml-0 px-4 py-2 bg-white text-blue-600 font-semibold rounded-r-md border-l border-gray-300 hover:bg-blue-600 hover:text-white transition-all"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
