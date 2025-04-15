import axios from 'axios';

const BASE_URL = "https://polar-dawn-37707.herokuapp.com";

export const SignUpFormApi = async (phone, referralCode = "") => {
  try {
    const response = await axios.post(`${BASE_URL}/sign_up`, {
      mobile: phone,
      referral_code: referralCode
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;

  } catch (error) {
    console.error("Signup API Error:", error.response || error.message);
    throw error;
  }
};
