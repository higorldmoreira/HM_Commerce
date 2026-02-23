/* eslint-disable no-undef */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RoutesComponent } from './routes/routes'
import { BrowserRouter } from 'react-router-dom'
import { DefaultTheme } from './shared/themes'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext'
import GlobalStyles from './styles/globalStyles'
import { FeedbackProvider } from './contexts/FeedbackContext'
import { fetchConfig } from './configLoader'
import { ComboProvider } from './features/combo'
import { CommercialProvider } from './contexts/CommercialContext'

const initializeApp = async () => {
  try {
    const config = await fetchConfig()

    console.log('Inicializando Config', config)
    // Salvar o config em uma variável global ou Context
    window.runtimeConfig = config // Uma abordagem simples
    
    const root = createRoot(document.getElementById('root'))
    root.render(
      <BrowserRouter>
        <FeedbackProvider>
          <AuthProvider>
            <CommercialProvider>
              <ComboProvider>
                <ThemeProvider theme={DefaultTheme}>
                  <GlobalStyles />
                  <RoutesComponent />
                </ThemeProvider>
              </ComboProvider>
            </CommercialProvider>
          </AuthProvider>
        </FeedbackProvider>
      </BrowserRouter>
    )
  } catch (error) {
    console.error('Erro ao carregar a configuração:', error)
    // Renderizar uma tela de erro ou fallback
    const root = createRoot(document.getElementById('root'))
    root.render(
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h1>Erro de Configuração</h1>
        <p>Não foi possível carregar a aplicação. Verifique o console para mais detalhes.</p>
        <p style={{color: 'red', fontSize: '14px'}}>{error.message}</p>
      </div>
    )
  }
}

// Tratamento global de erros não capturados
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason)
  // Evita que o erro apareça no console do navegador
  event.preventDefault()
})

window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error)
})

initializeApp()
