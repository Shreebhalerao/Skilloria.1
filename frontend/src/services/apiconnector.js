// import axios from "axios"
// import { data } from "react-router-dom";


// export const axiosInstance = axios.create({});


// export const apiconnector =(method ,url, bodyData,headers,params)=>{
//     return axiosInstance({
//         method: `${method}`,
//         url: `${url}`,
//         data:bodyData ?bodyData:null,
//         headers:headers ? headers :null,
//         params:params ? params:null,
//     })
// }

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // <-- this points to your Render backend
  withCredentials: false, // true only if you need cookies
});

export const apiconnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
  });
};
