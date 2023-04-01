import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_TIMEOUT_MS = 5000

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com/',
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${"YOUR_TOKEN"}`
  }
})



const responseHandler = (response: AxiosResponse) => {
 
  if (response.status === 200) {

    
    // handle success case
  } else if (response.status === 401) {
    // handle unauthorized case
  } else if (response.status === 404) {
    // handle not found case
  } else {
    // handle other cases
  }

  return response;
};


axiosInstance.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

const fetchData = async (data?: any): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(data)
    console.log(response.data)
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const postData = async (url: string, data?: any): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.post(url, data)
    console.log(response.data)
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { axiosInstance, fetchData, postData }
function errorHandler(error: any): any {
  throw new Error('Function not implemented.');
}

