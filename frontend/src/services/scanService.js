// Scan service: handles image upload, AI prediction, history fetching, and report download
import axios from 'axios'
import authService from './authService'

const API_BASE = '/api'

function authHeaders() {
  return { Authorization: `Bearer ${authService.getToken()}` }
}

export const scanService = {
  async uploadAndPredict(imageFile, symptoms, patientInfo) {
    // TODO: Replace with real API call
    // Template: POST /upload then POST /predict with returned image path
    // const formData = new FormData()
    // formData.append('file', imageFile)
    // formData.append('symptoms', JSON.stringify(symptoms))
    // formData.append('patient_info', JSON.stringify(patientInfo))
    // const response = await axios.post(`${API_BASE}/predict`, formData, {
    //   headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    // })
    // return response.data
    return new Promise((resolve) =>
      setTimeout(() => {
        const isPneumonia = Math.random() > 0.5
        resolve({
          id: Date.now(),
          prediction: isPneumonia ? 'Pneumonia' : 'Normal',
          confidence: (75 + Math.random() * 20).toFixed(1),
          image_url: URL.createObjectURL(imageFile),
          explanation: isPneumonia
            ? 'The model detected abnormal opacity patterns in lung regions that are commonly associated with pneumonia. Consolidation visible in the lower right lobe.'
            : 'No significant abnormalities detected. Lung fields appear clear with no consolidation or infiltrates observed.',
          heatmap_url: null,
        })
      }, 2500)
    )
  },

  async getHistory() {
    // TODO: Replace with real API call
    // Template: GET /history with auth header
    // const response = await axios.get(`${API_BASE}/history`, { headers: authHeaders() })
    // return response.data
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: 1, created_at: '2024-03-15T10:30:00', prediction: 'Pneumonia', confidence: 94.6, file_name: 'chest_xray_001.jpg' },
          { id: 2, created_at: '2024-03-12T14:20:00', prediction: 'Normal', confidence: 89.2, file_name: 'scan_march_12.png' },
          { id: 3, created_at: '2024-03-08T09:15:00', prediction: 'Normal', confidence: 96.1, file_name: 'xray_03082024.jpg' },
          { id: 4, created_at: '2024-02-28T16:45:00', prediction: 'Pneumonia', confidence: 88.3, file_name: 'chest_feb28.jpeg' },
          { id: 5, created_at: '2024-02-20T11:00:00', prediction: 'Normal', confidence: 91.7, file_name: 'scan_feb20.png' },
        ])
      }, 700)
    )
  },

  async deleteScan(id) {
    // TODO: Replace with real API call
    // Template: DELETE /history/{id} with auth header
    // await axios.delete(`${API_BASE}/history/${id}`, { headers: authHeaders() })
    return new Promise((resolve) => setTimeout(() => resolve(), 400))
  },

  async downloadReport(scanId) {
    // TODO: Replace with real API call
    // Template: GET /report/{id} as blob for PDF download
    // const response = await axios.get(`${API_BASE}/report/${scanId}`, {
    //   headers: authHeaders(),
    //   responseType: 'blob'
    // })
    // const url = window.URL.createObjectURL(new Blob([response.data]))
    // const link = document.createElement('a')
    // link.href = url
    // link.setAttribute('download', `pneumovision_report_${scanId}.pdf`)
    // document.body.appendChild(link)
    // link.click()
    // link.remove()
    return new Promise((resolve) => setTimeout(() => resolve(), 300))
  },

  async getStats() {
    // TODO: Replace with real API call
    // Template: GET /stats with auth header
    // const response = await axios.get(`${API_BASE}/stats`, { headers: authHeaders() })
    // return response.data
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          total_scans: 5,
          pneumonia_cases: 2,
          normal_cases: 3,
          latest_prediction: 'Pneumonia',
        })
      }, 500)
    )
  },
}

export default scanService
