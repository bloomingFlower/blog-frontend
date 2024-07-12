import React from 'react';
import { Link } from 'react-router-dom';

function SearchResults({ results, onClose }) {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Search Results</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    Close
                </button>
            </div>
            {results.length > 0 ? (
                <ul className="space-y-4">
                    {results.map((item) => (
                        <li key={item.id} className="border-b pb-2">
                            <Link to={item.type === 'post' ? `/post/${item.id}` : `/scrap/${item.id}`} className="block">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description || item.content.substring(0, 100)}...</p>
                                <span className="text-xs text-gray-500">{item.type}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}

export default SearchResults;