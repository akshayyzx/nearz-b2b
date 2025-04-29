import axios from 'axios';

const BASE_URL = "https://shielded-scrubland-64985.herokuapp.com";

export const SignUpFormApi = async (phone, referralCode = "", name = "") => { 
  try {
    const response = await axios.post(`${BASE_URL}/sign_up`, {
      mobile: phone,
      referral_code: referralCode,
      name: name // Only send phone number, referral code, and name
    });

    return response.data;

  } catch (error) {
    console.error("Signup API Error:", error.response || error.message);
    throw error;
  }
};
