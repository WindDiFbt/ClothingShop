import axios from "axios";
import nProgress from "nprogress";

const API_URL = 'http://localhost:5078/api';

const API = axios.create({
    baseURL: API_URL});

    // ====== Token utils ======
function getToken() {
    // Ưu tiên Redux hoặc localStorage
    return localStorage.getItem("token");
}
// ========== Request Interceptor ==========
API.interceptors.request.use(
    (config) => {
        nProgress.start();
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        nProgress.done();
        return Promise.reject(error);
    }
);
// ========== Token Refresh Logic ==========
let isRefreshing = false;
let refreshSubscribers = [];

function onTokenRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

async function refreshToken() {
    // Gọi API refresh nếu bạn có
    const refreshToken = localStorage.getItem("refreshToken"); // tuỳ bạn lưu
    const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const newToken = res.data.token;

    // Lưu lại token mới
    localStorage.setItem("token", newToken);
    return newToken;
}

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

// ========== Response Interceptor ==========
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
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });
            }

            isRefreshing = true;
            try {
                const newToken = await refreshToken();
                isRefreshing = false;
                onTokenRefreshed(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (err) {
                isRefreshing = false;
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default API;