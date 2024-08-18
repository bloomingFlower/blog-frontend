import React, { useState, useEffect } from "react";
import { api } from "./components/api";
import LoadingIndicator from "./components/LoadingIndicator";
import { Link } from "react-router-dom";

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

const MobileRSSViewer: React.FC = () => {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRSSFeed();
  }, []);

  const fetchRSSFeed = async () => {
    try {
      const response = await api.get("/api/v1/rss");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      const parsedItems: RSSItem[] = Array.from(items).map((item) => ({
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
      }));

      setRssItems(parsedItems);
    } catch (error) {
      console.error("Fail to get RSS feeds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-2 max-w-md mx-auto bg-white bg-opacity-90 min-h-screen pb-16">
      <h1 className="text-lg font-semibold mb-3">Recent Posts</h1>
      <p className="text-xs text-gray-500 mb-2">Mobile version</p>
      <ul className="space-y-2">
        {rssItems.map((item, index) => (
          <li key={index} className="border-b border-gray-200 pb-2">
            <Link to={item.link} className="block">
              <h2 className="text-sm font-medium text-blue-600">
                {item.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.pubDate).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" className="mt-4 block text-center text-sm text-blue-500">
        Back to home
      </Link>
    </div>
  );
};

export default MobileRSSViewer;
