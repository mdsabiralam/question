import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const logEvent = async (intent: string, params: object = {}) => {
    try {
        // Fire and forget, but axios returns promise
        await axios.post(`${API_URL}/api/log-event`, {
            userId: 'teacher-123', // Hardcoded user ID until auth is implemented
            intent,
            params
        });
    } catch (error) {
        // Silent fail to avoid disrupting user experience
        console.error("Event logging failed (silent):", error);
    }
};
