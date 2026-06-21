import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 })

export const predictRisk = async (payload) => {
  const { data } = await api.post('/api/predict', payload)
  return data
}

export const fetchStats = async () => {
  const { data } = await api.get('/api/stats')
  return data
}

export default api
