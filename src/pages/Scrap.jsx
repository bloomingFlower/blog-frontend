import React, { useState, useEffect } from 'react';
import { ApiServiceClient } from '../../protos/ApiServiceClientPb';
import { GetPostsForUserRequest, GetFeedsRequest } from '../../protos/api_pb';
import backgroundImage from "@img/background2.png";
import logger from '../utils/logger';

const formatDate = (seconds) => {
  return new Date(seconds * 1000).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

function Scrap() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new ApiServiceClient(`${process.env.REACT_GRPC_API_URL}`, null, {
          withCredentials: true,
        });
        const request = new GetPostsForUserRequest();
        request.setUserid('ba1af24d-9bfc-4f40-8c9c-9c1ea87b69fa');
        request.setLimit('10');

        const metadata = {
          'Content-Type': 'application/grpc-web+proto',
          'X-Grpc-Web': '1',
          'api_key': `${process.env.GRPC_API_KEY}`
        };

        const stream = client.handlerGetPostsForUser(request, metadata);
        const receivedPosts = [];

        stream.on('data', (response) => {
          receivedPosts.push(response.toObject());
        });

        stream.on('status', (status) => {
          logger.debug('Stream status:', status);
        });

        stream.on('end', () => {
          logger.info(`Stream ended. Total posts received: ${receivedPosts.length}`);
          setPosts(receivedPosts);
        });

        stream.on('error', (err) => {
          logger.error('Stream error:', err);
        });
      } catch (error) {
        logger.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-cover py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <h1 className="text-3xl font-bold text-center my-6 text-gray-800">스크랩한 게시물</h1>
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {post.title}
              </a>
            </h2>
            <p className="text-gray-600 mb-4">{post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>게시일: {formatDate(post.publishedat.seconds)}</span>
              <span>최종 수정일: {formatDate(post.updatedat.seconds)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scrap;