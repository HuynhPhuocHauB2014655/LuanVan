import axios from 'axios';

// Get the appropriate API base URL based on the environment
const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // For Desktop, use VITE_API_BASE_URL (localhost)
        return import.meta.env.VITE_API_BASE_URL;
    } else {
        // For Mobile (running on local network), use VITE_API_BASE_URL_PHONE
        return import.meta.env.VITE_API_BASE_URL_PHONE;
    }
};

// Create axios client with dynamic baseURL
const axiosClient = axios.create({
    baseURL: `${getBaseUrl()}/api`,  // Dynamically choose the base URL
});

export default axiosClient;