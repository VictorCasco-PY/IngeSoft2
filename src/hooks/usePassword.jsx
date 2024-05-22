import { useState } from "react";
import api from "../utils/api";

export const usePassword = () => {

    const URL = "/password"

    const needChange = async () =>{
        const response = await api.get(`${URL}/need-change`)
        return response.data;  
    }

    return {needChange}

}