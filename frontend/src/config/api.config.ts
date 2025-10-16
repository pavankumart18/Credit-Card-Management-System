import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// API Base URL from environment (using port 5001 to avoid AirPlay conflict)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Log API configuration for debugging
console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    env: import.meta.env.VITE_API_BASE_URL,
});

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable cookies
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage or cookies
        const token = localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log outgoing requests
        console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            hasToken: !!token,
        });

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log('✅ API Response:', {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error: AxiosError) => {
        // Log errors
        console.error('❌ API Error:', {
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
        });

        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth data and redirect to login
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            Cookies.remove(TOKEN_KEY);

            // Only redirect if not already on auth page
            if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/auth';
            }
        }

        return Promise.reject(error);
    }
);

// Token management utilities
export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(TOKEN_KEY, token, { expires: 30, sameSite: 'strict' }); // 30 days
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
};

export const removeAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY);
};

export const setUserData = (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
    localStorage.removeItem(USER_KEY);
};

export const clearAuthData = () => {
    removeAuthToken();
    removeUserData();
};

export default apiClient;

