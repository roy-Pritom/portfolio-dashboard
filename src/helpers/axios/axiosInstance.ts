import { AuthKey } from "@/constants";
import setAccessToken from "@/services/actions/setAccessToken";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/localStorage";
import axios from "axios";


const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accepts"] = "application/json";
instance.defaults.timeout = 60000;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const accessToken=getFromLocalStorage(AuthKey);
    if(accessToken){
        config.headers.Authorization=accessToken;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
     // Any status code that lie within the range of 2xx cause this function to trigger
     // Do something with response data
     const responseObject: any= {
        data: response?.data?.data,
        meta: response?.data?.meta,
     };
     return responseObject;
  },
  async function (error) {
     // Any status codes that falls outside the range of 2xx cause this function to trigger
     // Do something with response error
     // console.log(error);
  
        const responseObject:any = {
           statusCode: error?.response?.data?.statusCode || 500,
           message:
              error?.response?.data?.message || 'Something went wrong!!!',
           errorMessages: error?.response?.data?.message,
        };
        // return Promise.reject(error);
        return responseObject;
     }
  
);


  export {instance};