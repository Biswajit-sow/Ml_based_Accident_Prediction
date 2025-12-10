import axios from "axios";

// Use full Flask backend URL!
const API = axios.create({
  baseURL: "http://localhost:5000", // Or your deployed backend URL
});

export default API;
