
import axios from 'axios';

const BASE_URL = "https://polar-dawn-37707.herokuapp.com";



export const VerifyLoginApi = async (phone, otp) => {
    const formData = new FormData();
    formData.append("mobile", phone);
    formData.append("code", otp);
    
    const response = await axios.post(`${BASE_URL}/verify`, formData);
    return response.data; 
};