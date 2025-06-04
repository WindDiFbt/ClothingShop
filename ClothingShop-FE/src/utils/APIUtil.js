import axios from "axios";
import nProgress from "nprogress";

const API_URL = 'http://localhost:5078/api';

const API = axios.create({
    baseURL: API_URL});

API.interceptors.request.use(
    (config) => {
        nProgress.start();
        return config;
    },
    (error) => {
        nProgress.done();
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        nProgress.done();
        return response;
    },
    async (error) => {
        nProgress.done();
        const { config, response } = error;
        const originalRequest = config;
        if (config.skipAuthRefresh) {
            return Promise.reject(error);
        }
        if (response && response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });
            }
            originalRequest._retry = true;
        }
        return Promise.reject(error);
    }
);

export default API;