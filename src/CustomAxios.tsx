import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './Config';


const API_TIMEOUT_MS = 5000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
});



const requestHandler = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  let token = localStorage.getItem("token");
    // // Token will be dynamic so we can use any app-specific way to always   
    // // fetch the new token before making the call
    if(token){
        request.headers.Authorization = `Bearer ${token}`;  
    }
    
    return request;
};

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

axiosInstance.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

axiosInstance.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

const fetchData = async (url: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

const postData = async (url: string, data?: any): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

function errorHandler(error: any) {
  throw new Error(error.response.data.message);
}

export { axiosInstance, fetchData, postData };
