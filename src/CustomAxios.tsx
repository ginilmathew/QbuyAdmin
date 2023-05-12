import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './Config';
import { useSession } from "next-auth/react"


const API_TIMEOUT_MS = 5000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  //timeout: API_TIMEOUT_MS,
});



const requestHandler = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  let token = localStorage.getItem("token");
  console.log({token})
    // // Token will be dynamic so we can use any app-specific way to always   
    // // fetch the new token before making the call
    if(token){
        request.headers.Authorization = `Bearer ${token}`;  
    }
    
    return request;
};

const responseHandler = async(response: AxiosResponse) => {

  if (response.status === 200) {
    // handle success case
  } else if (response.status === 403) {
    // handle unauthorized case
    await localStorage.clear();
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

const deleteData = async (url: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};


async function errorHandler(error: any) {
  console.log({error : error.response.status})
  if(error.response.status === 403){
    localStorage.clear()
    //await userContext.setUser(response.data.user)
  }
  throw new Error(error.response.data.message);
}

export { axiosInstance, fetchData, postData,deleteData };
