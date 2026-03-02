import axios from 'axios'

/**
 * Axios instance pre-configured for the AI Smart Inbox API.
 *
 * Base URL resolution order:
 *   1. VITE_API_URL environment variable (set in .env or at build time)
 *   2. http://localhost:4001/api  (default dev port)
 *
 * All authenticated requests automatically include the JWT from localStorage.
 * A 401 response clears the stored token and redirects to the login page.
 */

const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4001/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT bearer token to every outgoing request when available.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle authentication errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
