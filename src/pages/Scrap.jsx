import React, { useState, useEffect } from 'react';
import { ApiServiceClient } from '../../protos/ApiServiceClientPb';
import { GetPostsForUserRequest, GetFeedsRequest } from '../../protos/api_pb';
import backgroundImage from "@img/background2.png";

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
          console.log('Received post:', response.toObject());
          receivedPosts.push(response.toObject());
        });

        stream.on('status', (status) => {
          console.log('Stream status:', status);
        });

        stream.on('end', () => {
          console.log('Stream ended. Total posts received:', receivedPosts.length);
          setPosts(receivedPosts);
        });

        stream.on('error', (err) => {
          console.error('Stream error:', err);
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div>
        {posts && posts.map((item) => (
          <div key={item.guid}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scrap;