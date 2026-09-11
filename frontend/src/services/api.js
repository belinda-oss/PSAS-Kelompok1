import axios from 'axios';

/**
 * Axios instance for Laravel Backend API
 */
export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Axios instance for Python FastAPI AI Service
 */
export const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_SERVICE_URL || 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    api,
    aiApi
};
