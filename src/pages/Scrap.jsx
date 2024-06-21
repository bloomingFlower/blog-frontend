import React, { useState, useEffect } from 'react';
import { ApiServiceClient } from '../../protos/ApiServiceClientPb';
import { GetPostsForUserRequest } from '../../protos/api_pb';
import backgroundImage from "@img/background2.png";

function Scrap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new ApiServiceClient(`${process.env.REACT_GRPC_API_URL}`, null, null);
        // const client = new ApiServiceClient(`localhost:50051`, null, null);

        const request = new GetPostsForUserRequest();
        request.setUserid('ba1af24d-9bfc-4f40-8c9c-9c1ea87b69fa');
        request.setLimit("10");

        const stream = client.handlerGetPostsForUser(request);

        stream.on('data', (response) => {
          setData(oldData => [...oldData, response]);
          console.log(response);
        });

        stream.on('error', (error) => {
          console.error(error);
        });

        stream.on('end', () => {
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