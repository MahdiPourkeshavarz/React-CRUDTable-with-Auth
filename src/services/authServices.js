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
  (config) => {
    return config;
  },
  (error) => {
    const status = error.response.status;
    const originRequest = error.config;
    const refresh = localStorage.getItem("refreshToken");

    if (status === 401 && refresh) {
      return getRefreshToken(refresh)
        .then((res) => {
          console.log(res);
          localStorage.setItem("accessToken", res.data.access);
          return httpRequest.request(originRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
  }
);

async function getRefreshToken() {
  try {
    const response = await httpRequest.get(API_URL.REFRESH_TOKEN_URL);
    return response.data;
  } catch (e) {
    return e.message;
  }
}
