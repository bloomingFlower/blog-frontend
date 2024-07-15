import axios from "axios";
import { useState } from "react";

const useApiCall = () => {
  const [loading, setLoading] = useState(false);

  const callApi = async (
    method,
    url,
    data = null,
    headers = null,
    withCredentials = false
  ) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
        withCredentials,
      });
      setLoading(false);
      return [null, response.data];
    } catch (error) {
      setLoading(false);
      if (error.response) {
        return [error.response.data, null];
      } else if (error.request) {
        return [error.request, null];
      } else {
        return [error.message, null];
      }
    }
  };

  return { callApi, loading };
};

export default useApiCall;
