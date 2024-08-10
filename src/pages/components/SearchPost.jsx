import React, { useState } from "react";
import { api } from "./api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
      toast.error("Search error:", error);
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full max-w-3xl mx-auto"
    >
      <div className="relative flex w-full bg-white rounded-full overflow-hidden shadow-md">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-10 pl-3 pr-2 text-xs bg-white text-gray-700 border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="title">Title</option>
          <option value="content">Content</option>
          <option value="tags">Tags</option>
        </select>
        <div className="relative flex-grow">
          <input
            id="searchInput"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full h-10 pl-2 pr-16 text-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-0 h-10 w-10 flex items-center justify-center text-gray-600 hover:text-red-500"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-600 hover:text-blue-500"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

export default SearchComponent;
