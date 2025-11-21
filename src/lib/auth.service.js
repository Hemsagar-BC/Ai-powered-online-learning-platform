import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken')
  }

  setToken(token) {
    this.token = token
    localStorage.setItem('authToken', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  getToken() {
    return this.token
  }

  isAuthenticated() {
    return !!this.token
  }

  async signUp(email, password, name) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        name
      })
      this.setToken(response.data.token)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Sign up failed')
    }
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })
      this.setToken(response.data.token)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async googleLogin(token) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        token
      })
      this.setToken(response.data.token)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google login failed')
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user')
    }
  }

  async logout() {
    localStorage.removeItem('authToken')
    this.token = null
    delete axios.defaults.headers.common['Authorization']
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        token: this.token
      })
      this.setToken(response.data.token)
      return response.data.token
    } catch (error) {
      this.logout()
      throw new Error('Token refresh failed')
    }
  }
}

export default new AuthService()
