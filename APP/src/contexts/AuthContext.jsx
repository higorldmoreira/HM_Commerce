import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../enums/routePaths'
import { useFeedback } from './FeedbackContext'
import { getApiInstance } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate() 
  const { showMessage } = useFeedback()
  const api = getApiInstance()
  const login = async ({ username, password }) => {
    try {
      const token = await AuthService.login(username, password)
      setIsAuthenticated(!!token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      navigate(ROUTE_PATHS.home) 
    } catch (error) {
      showMessage('Erro ao autenticar!', 'error')
      setIsAuthenticated(false)
      navigate(ROUTE_PATHS.login) 
    }
  }

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    navigate(ROUTE_PATHS.login) 
  }

  useEffect(() => {
    const token = AuthService.getToken()
    if (token && !AuthService.isTokenExpired(token)) {
      setIsAuthenticated(true)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      logout()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
