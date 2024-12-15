import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/contacts",
    
});

export const fetchContacts = async() => api.get("/");
export const addContact = async(contact) => api.post("/", contact);
export const updateContact = async(id, contact) => api.put(`/${id}`, contact);
export const deleteContact = async(id) => api.delete(`/${id}`);
export const searchContacts = async(query) => api.get(`/?search=${query}`);

export default api;