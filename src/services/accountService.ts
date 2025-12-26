import axios from 'axios';
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1";

export const sendVerifyEmail = async (email) => {
  try {
    const response = await axios.post(`/email/send-verify-mail/${email}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw Error(err)
  }
}
export const sendOTPEmail = async (current_password) => {
  try {
    const response = await axios.post(`/email/send-otp-email?current_password=${current_password}`, {}, {
      headers: {
        Authorization: `Bearer ${getTokenCookie()}`
      }
    });
    return response.data;
  } catch (err) {
    throw err?.response?.data?.detail
  }
}
export const sendOTPVerify = async (otp, newPassword) => {
  try {
    const response = await axios.post(`/user/verify-otp?otp=${otp}&new_password=${newPassword}`, {}, {
      headers: {
        Authorization: `Bearer ${getTokenCookie()}`
      }
    });
    return response.data;
  } catch (err) {
    throw err?.response?.data?.detail
  }
}
export const verifyEmail = async (token) => {
  try {
    const response = await axios.post(`/email/verify-mail/${token}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw Error(err)
  }
}

export const createOrder = async (method, pack) => {
  try {
    const res = await axios.post(`/payment/${method}/create`, { pack }, {
      headers: {
        Authorization: `Bearer ${getTokenCookie()}`
      }
    });
    return res.data;
  } catch (err) {
    return err
  }
}

export const update = async (data) => {
  try {
    const res = await axios.patch(`/user/update`, data, {
      headers: {
        Authorization: `Bearer ${getTokenCookie()}`
      }
    });
    return res.data;
  } catch (err) {
    return err
  }
}
export const login = async (email, password) => {
  try {
    const res = await axios.post(`/user/login`, { email: email, password: password });
    return res.data;
  } catch (err) {
    return err
  }
}

export const getByEmail = async (email) => {
  try {
    const res = await axios.get(`/user/get-by-email/${email}`);
    return res.data;
  } catch (err) {
    return err
  }
}
export const isEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const logout = () => {
  deleteTokenCookie();
  window.localStorage.removeItem('alex_account_email');
  window.localStorage.removeItem('alex_account_username');
  window.localStorage.removeItem('alex_account_id');
  setTimeout(() => {
    window.location.reload();
  }, 200);
}


export function setTokenCookie(token, days = 1) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `alex_access_token=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
}

export function deleteTokenCookie() {
  document.cookie = "alex_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
}

export function getTokenCookie() {
  const name = "alex_access_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
