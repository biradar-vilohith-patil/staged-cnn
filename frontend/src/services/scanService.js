import axios from 'axios';
import authService from './authService';

// Strictly use relative path so Vite proxy catches it
const API_BASE = '/api';

function authHeaders() {
  return { Authorization: `Bearer ${authService.getToken()}` };
}

export const scanService = {
  async uploadAndPredict(imageFile) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("Must be logged in to upload scans.");

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('email', user.email);

    const response = await axios.post(`${API_BASE}/predict`, formData, {
      headers: { 
        ...authHeaders(), 
        'Content-Type': 'multipart/form-data' 
      }
    });
    
    return {
      prediction: response.data.prediction,
      confidence: response.data.confidence,
      explanation: response.data.explanation,
      image_url: URL.createObjectURL(imageFile)
    };
  },

  async getHistory() {
    const user = authService.getCurrentUser();
    if (!user) return [];

    const response = await axios.get(`${API_BASE}/history/${user.email}`, { 
        headers: authHeaders() 
    });
    return response.data;
  }
};

export default scanService;