import React, { useState } from "react";
import api from "./api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function SearchComponent({ setSearchResults }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      toast.warning("Please enter a search term.");
      return;
    }
    try {
      const response = await trackPromise(
        api.get("/api/v1/posts/search", {
          params: {
            query,
            type: searchType,
          },
        })
      );
      if (response.data.data.length > 0) {
        setSearchResults(response.data.data);
      } else {
        toast.info("No results found. Showing all posts.");
      }
    } catch (error) {
      toast.error("Error searching:", error);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-stretch w-full max-w-md mx-auto h-9"
    >
      <div className="relative flex-grow">
        <input
          id="searchInput"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full h-full pl-2 pr-16 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="absolute right-0 top-0 h-full w-14 text-xs bg-transparent border-l border-gray-300 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="title">Title</option>
          <option value="content">Content</option>
          <option value="tags">Tags</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 text-sm rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}

export default SearchComponent;
