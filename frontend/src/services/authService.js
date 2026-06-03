import axios from 'axios'

// Force the app to use a relative path so the Vite proxy catches it
const API_BASE = '/auth';

export const authService = {
  async register(userData){
    // Match the exact contract FastAPI expects
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    const r = await axios.post(`${API_BASE}/register`, payload);
    return r.data;
  },
  
  async login(email, password){
    const r = await axios.post(`${API_BASE}/login`, { email, password });
    // Correctly split and store the Supabase token and user data
    localStorage.setItem('pv_token', r.data.access_token);
    localStorage.setItem('pv_user', JSON.stringify(r.data.user));
    return r.data;
  },
  
  logout(){
    localStorage.removeItem('pv_user');
    localStorage.removeItem('pv_token');
  },
  
  getCurrentUser(){
    const u = localStorage.getItem('pv_user');
    return u ? JSON.parse(u) : null;
  },
  
  getToken(){
    return localStorage.getItem('pv_token');
  },
  
  async updateProfile(data){
    const u = { ...(this.getCurrentUser() || {}), ...data };
    localStorage.setItem('pv_user', JSON.stringify(u)); 
    return u;
  }
};

export default authService;