// services/api.js
import axios from 'axios'
import { AuthService } from './AuthService'

let apiInstance = null

export const getApiInstance = () => {
  if (!apiInstance) {
    const baseURL = window.runtimeConfig?.URL_BASE_API
    if (!baseURL) {
      throw new Error('A URL_BASE_API não foi carregada.')
    }

    apiInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain;q=0.9'
      },
      timeout: 30000 // 30 segundos de timeout
    })

    // Intercepta as requisições e adiciona o token
    apiInstance.interceptors.request.use(
      config => {
        // Não adicionar token para rotas de login
        const isLoginRoute = config.url?.includes('/Login') || config.url?.includes('/login')
        
        if (!isLoginRoute) {
          const token = AuthService.getToken()
          if (token && token !== 'null' && !AuthService.isTokenExpired(token)) {
            config.headers.Authorization = `Bearer ${token}`
          } else if (token) {
            AuthService.logout()
          }
        }
        
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Intercepta as respostas para lidar com erros de autenticação
    apiInstance.interceptors.response.use(
      response => response,
      async error => {
        const { response } = error
        
        if (response?.status === 401) {
          AuthService.logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/'
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  return apiInstance
}
