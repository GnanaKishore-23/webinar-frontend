import axios from 'axios';

const API = "http://127.0.0.1:8080/api";

export const getWebinars = () => axios.get(API_URL);
export const createWebinar = (data) => axios.post(API_URL, data);
export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
export const updateResources = (id, data) => axios.put(`${API_URL}/${id}/resources`, data);