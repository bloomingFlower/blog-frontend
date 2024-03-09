import React, { useState, useEffect } from 'react';
import { ApiServiceClient } from '../../protos/ApiServiceClientPb';
import { GetPostsForUserRequest } from '../../protos/api_pb';
import backgroundImage from "@img/background2.png";

const Scrap: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const client = new ApiServiceClient(`${process.env.REACT_APP_API_URL}:50051`, null, null);
        // const client = new ApiServiceClient(`localhost:50051`, null, null);

        const request = new GetPostsForUserRequest();
        request.setUserid('e3256417-d2db-4a76-8a1b-924de3d34367');
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
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div>
        {data && data.map((item: any) => (
            <div key={item.guid}>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Scrap;