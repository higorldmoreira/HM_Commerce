export const fetchConfig = async () => {
  try {
    // Detectar se está em desenvolvimento (localhost:5173)
    const isDev = window.location.hostname === 'localhost' && window.location.port === '5173'
    const configFile = isDev ? './config.dev.json' : './config.json'
    
    console.log(`🔧 Carregando configuração: ${configFile} (isDev: ${isDev})`)
    
    const response = await fetch(configFile)
    if (!response.ok) {
      console.error('Erro ao carregar config:', response.status, response.statusText)
      
      // Se config.dev.json não existir em dev, tenta config.json
      if (isDev && response.status === 404) {
        console.log('Tentando config.json como fallback...')
        const fallbackResponse = await fetch('./config.json')
        if (fallbackResponse.ok) {
          const config = await fallbackResponse.json()
          console.log('✅ Configuração de fallback carregada:', config)
          return config
        }
      }
      
      throw new Error(`HTTP ${response.status}: Não foi possível carregar o arquivo de configuração.`)
    }
    
    const config = await response.json()
    console.log('✅ Configuração carregada:', config)
    return config
  } catch (error) {
    console.error('❌ Erro no fetchConfig:', error)
    
    // Fallback configuration baseado no ambiente
    const isDev = window.location.hostname === 'localhost'
    const fallbackConfig = {
      URL_BASE_API: "/api"
    }
    
    console.log('⚠️ Usando configuração de fallback:', fallbackConfig)
    return fallbackConfig
  }
}
