import React, { useState, useEffect } from 'react';
import {trackPromise} from "react-promise-tracker";
import api from "./components/api";
// protoc -I=./proto --js_out=import_style=commonjs,binary:./src --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src ./proto/your_service.proto
const Scrap: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await trackPromise(api.get('http://example.com/api-endpoint'));
        setData(response.data);
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
      <div>
        {data && data.items.map((item: any) => (
            <div key={item.guid}>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </div>
        ))}
      </div>
  );
};

export default Scrap;