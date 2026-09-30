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
    baseURL: import.meta.env.VITE_AI_SERVICE_URL || '/ai-api/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    api,
    aiApi
};
