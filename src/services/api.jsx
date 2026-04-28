import axios from 'axios';
const API = "http://localhost:8080/api";

export const authAPI = {
    login: (data) => axios.post(`${API}/auth/login`, data),
    signup: (data) => axios.post(`${API}/auth/signup`, data)
};

export const webinarAPI = {
    getAll: () => axios.get(`${API}/webinars`),
    create: (data) => axios.post(`${API}/webinars`, data),
    delete: (id) => axios.delete(`${API}/webinars/${id}`),
    saveRecording: (id, url) => axios.post(`${API}/webinars/${id}/record`, { url })
};