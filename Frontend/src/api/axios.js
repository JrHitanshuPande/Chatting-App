import axios from "axios";
import { store } from "../store/store"
import { logout, refreshtoken } from "../store/slices/userSlice"

const axiosinstance = axios.create(
    {
        baseURL: import.meta.env.VITE_BACKEND_URL,
        withCredentials: true
    }
)

axiosinstance.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().user.token;
        console.log("accessToken", accessToken);
        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false;
let otherRequest = [];

const processOther = (error, token = null) => {
    otherRequest.forEach((item) => {
        if (error) {
            item.reject(error);
        } else {
            item.resolve(token);
        }
    })
    otherRequest = [];
}


axiosinstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    otherRequest.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.authorization = `Bearer ${token}`;
                    return axiosinstance(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                })
            }

            isRefreshing = true;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/refreshtoken`,
                    {
                        withCredentials: true,
                    }
                );
                const accessToken = response?.data?.token;
                store.dispatch(refreshtoken(accessToken));
                processOther(null, accessToken);
                originalRequest.headers.authorization = `Bearer ${accessToken}`;
                return axiosinstance(originalRequest);
            } catch (err) {
                store.dispatch(logout());
                processOther(err, null);
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
)



export default axiosinstance;