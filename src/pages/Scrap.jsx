import React, { useState, useEffect } from 'react';
import { grpc } from "@improbable-eng/grpc-web";
import { ApiServiceClient } from '../../protos/ApiServiceClientPb';
import { GetPostsForUserRequest } from '../../protos/api_pb';
import backgroundImage from "@img/background2.png";

function Scrap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const client = new ApiServiceClient(`${process.env.REACT_GRPC_API_URL}`, {
        withCredentials: true,
        transport: grpc.WebsocketTransport(),
        debug: process.env.NODE_ENV !== 'production',
      });

      const request = new GetPostsForUserRequest();
      request.setUserid('ba1af24d-9bfc-4f40-8c9c-9c1ea87b69fa');
      request.setLimit('10');

      const metadata = new grpc.Metadata();
      metadata.set('Content-Type', 'application/grpc-web-text');
      metadata.set('X-Grpc-Web', '1');

      client.handlerGetPostsForUser(request, metadata)
        .on('data', (response) => {
          console.log('Response:', response.toObject());
          setData(response.toObject());
        })
        .on('status', (status) => {
          console.log('Status:', status);
        })
        .on('metadata', (metadata) => {
          console.log('Metadata:', metadata);
        })
        .on('end', (trailers) => {
          console.log('Trailers:', trailers);
        });
    } catch (error) {
      console.error('Failed to create gRPC client:', error);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div>
        {data && data.map((item) => (
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