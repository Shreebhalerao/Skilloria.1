import axios from "axios"
import { data } from "react-router-dom";


export const axiosInstance = axios.create({});


export const apiconnector =(method ,url, bodyData,headers,params)=>{
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data:bodyData ?bodyData:null,
        headers:headers ? headers :null,
        params:params ? params:null,
    })
}