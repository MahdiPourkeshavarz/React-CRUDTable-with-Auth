/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_URL } from "../constants";

export const httpRequest = axios.create({
  baseURL: API_URL.BASE_URL,
});

httpRequest.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const originRequest = error.config;
    const refresh = localStorage.getItem("refreshToken");

    if (status === 401 && refresh) {
      return getRefreshToken(refresh)
        .then((res) => {
          localStorage.setItem("accessToken", res.access); // Adjusted to access property directly
          originRequest.headers.Authorization = `Bearer ${res.access}`; // Update the original request
          return httpRequest.request(originRequest); // Retry original request
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    return Promise.reject(error); // Reject if not handled
  }
);

async function getRefreshToken(refresh) {
  try {
    const response = await httpRequest.post(API_URL.REFRESH_TOKEN_URL, {
      refresh: refresh, // Include the refresh token in the body
    });
    return response.data;
  } catch (e) {
    return Promise.reject(e); // Properly reject the error
  }
}
