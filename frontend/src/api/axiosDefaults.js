import axios from "axios";

// Set default configurations for axios
axios.defaults.baseURL = "/api";  // Set base URL for all axios requests to API endpoint
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";  // Set default Content type for POST requests
axios.defaults.withCredentials = true;  // Include credentials in every request

// Create axios instances for request and response
export const axiosReq = axios.create();  // sending requests
export const axiosRes = axios.create();  // handling responses
