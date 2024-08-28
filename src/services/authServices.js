/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_URL } from "../constants";

export const httpRequest = axios.create({
  baseURL: API_URL.BASE_URL,
});

httpRequest.interceptors.request.use((req) => {
  // if (req.url !== API_URL.LOGIN_URL) {
  //   const token = localStorage.getItem("accessToken");
  //   req.headers.accessToken = `Bearer ${token}`;
  // }
  return req;
});

httpRequest.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;
    if (
      error.response.status === 403 &&
      originalRequest.url === API_URL.REFRESH_TOKEN_URL
    ) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await getRefreshToken();
        const res = httpRequest.post(originalRequest);
        return Promise.resolve(res);
      } catch (e) {
        localStorage.removeItem("accessToken");
      }
    }
    return Promise.reject(error);
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
