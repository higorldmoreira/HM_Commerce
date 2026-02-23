// services/AuthService.js
import axios from 'axios'

export const AuthService = {
  login: async (username, password) => {
    try {
      const API_URL = window.runtimeConfig?.URL_BASE_API
      if (!API_URL) {
        throw new Error('URL da API não configurada')
      }

      console.log('🔐 Tentando login para:', username, 'API:', API_URL)

      const loginAxios = axios.create({ 
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      })

      const response = await loginAxios.post('/Login', {
        username: username,
        password: password
      })

      console.log('✅ Login realizado com sucesso')
      const { token } = response.data

      if (!token) {
        throw new Error('Token não retornado pela API')
      }

      localStorage.setItem('token', JSON.stringify(response.data))
      localStorage.setItem('username', username)
      return token
    } catch (error) {
      console.error('❌ Erro no login:', error.message)
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Erro de rede: Verifique se a API está rodando e se o CORS está configurado')
      } else if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas')
      } else if (error.response?.status === 0) {
        throw new Error('CORS: Servidor não permite requisições desta origem')
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido no login')
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getToken: () => {
    try {
      const tokenData = localStorage.getItem('token')
      if (!tokenData || tokenData === 'null' || tokenData === 'undefined') {
        return null
      }
      const parsed = JSON.parse(tokenData)
      return parsed?.token || null
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  },

  getUsername: () => {
    const username = localStorage.getItem('username')
    return username && username !== 'null' ? username : null
  },

  isTokenExpired: token => {
    if (!token || token === 'null' || token === 'undefined') {
      return true
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp
      return expiry * 1000 < Date.now()
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error)
      return true
    }
  },

  refreshToken: async () => {
    const API_URL = window.runtimeConfig?.URL_BASE_API
    const currentToken = JSON.parse(localStorage.getItem('token'))

    if (!currentToken?.token || !currentToken?.refreshToken) {
      throw new Error('Token ou refresh token inexistente.')
    }

    const refreshAxios = axios.create({ baseURL: API_URL })
    const response = await refreshAxios.post('/Login/Refresh', {
      token: currentToken.token,
      refreshToken: currentToken.refreshToken
    })

    const { token } = response.data
    localStorage.setItem('token', JSON.stringify(response.data))
    return token
  }
}
