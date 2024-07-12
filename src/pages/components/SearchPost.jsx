import React, { useState } from 'react';
import api from "./api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";

function SearchComponent({ setSearchResults }) {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) {
            toast.warning('Please enter a search term');
            return;
        }
        try {
            const response = await trackPromise(api.get('/api/posts/search', {
                params: {
                    query,
                    type: searchType,
                },
            }));
            if (response.data.data.length > 0) {
                setSearchResults(response.data.data); // 검색 결과를 상태에 설정
            } else {
                toast.info('No search results found. Showing all posts.');
            }
        } catch (error) {
            console.error('Failed to perform search:', error);
            toast.error('Failed to perform search:', error);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex space-x-1 w-full">
            <input
                id="searchInput"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="hover:bg-gray-200 flex-grow rounded border-gray-300 p-2 text-sm"
            />
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="text-sm hover:bg-gray-200 rounded border-gray-300 p-2">
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="content">Content</option>
                <option value="tags">Tags</option>
            </select>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded whitespace-nowrap">Search</button>
        </form>
    );
}

export default SearchComponent;