import React from "react";

import { apiconnector } from "../apiconnector";
import {catalogData} from '../apis';


//---------get catalog page data--------

export const getCatalogPageData = async(categoryId)=>{
    let result = [];

    try {
          console.log("Calling:", catalogData.CATALOGPAGEDATA_API, { categoryId });
        const response = await apiconnector("POST" ,catalogData.CATALOGPAGEDATA_API, {categoryId});

        if(!response?.data?.success) throw new Error("Could not fetch category page data");

        console.log("CATALOG PAGE DATA API RESPONSE............", response)
        result = response?.data;

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR....", error);
        result = error.response?.data.data
    }

    return result;
}