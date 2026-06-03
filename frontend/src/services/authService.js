import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/auth';
export const authService = {
 async register(userData){
   const payload={...userData,confirm_password:userData.confirm};
   const r=await axios.post(`${API_BASE}/register`,payload);
   return r.data;
 },
 async login(email,password){
   const r=await axios.post(`${API_BASE}/login`,{email,password});
   localStorage.setItem('pv_user',JSON.stringify(r.data));
   return r.data;
 },
 logout(){localStorage.removeItem('pv_user');localStorage.removeItem('pv_token');},
 getCurrentUser(){const u=localStorage.getItem('pv_user');return u?JSON.parse(u):null;},
 getToken(){return localStorage.getItem('pv_token');},
 async updateProfile(data){const u={...(this.getCurrentUser()||{}),...data};localStorage.setItem('pv_user',JSON.stringify(u)); return u;}
};
export default authService;
