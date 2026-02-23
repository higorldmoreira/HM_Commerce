import { createTheme } from '@mui/material/styles'

// Criando o tema personalizado
export const DefaultTheme = createTheme({
  palette: {
    background: {
      default: '#FFFFFF' // Define a cor de fundo padrão do `body`
    },
    primary: {
      main: '#1559ed' // Azul principal
    },
    secondary: {
      main: '#ff9a1d' // Laranja principal
    },
    common: {
      white: '#FFFFFF', // Branco
      black: '#000000' // Preto
    },
    grey: {
      50: '#f0f0f0', // Cinza claro
      500: '#999999', // Cinza
      600: '#666666', // Cinza escuro
      700: '#d9d9d9', // Cinza médio
      800: '#aeaeae' // Cinza para textos menores
    }
  },
  typography: {
    // Padroniza tipografia com os estilos globais
    fontFamily: ['Work Sans', 'sans-serif'].join(','), // Fonte padrão do projeto
    h1: {
      fontSize: '39.66pt',
      fontWeight: 'bold',
      color: '#1559ed' // Azul para títulos principais
    },
    h2: {
      fontSize: '21.36pt',
      fontWeight: 'bold',
      color: '#1559ed' // Azul para subtítulos
    },
    h3: {
      fontSize: '18pt',
      fontWeight: 'bold',
      color: '#666666' // Cinza escuro para títulos internos
    },
    h6: {
      color: '#1559ed' // Azul para subtítulos
    },
    body1: {
      fontSize: '13pt',
      color: '#999999' // Cinza médio para texto de menu
    },
    body2: {
      fontSize: '12pt',
      color: '#666666' // Cinza escuro para textos menores
    },
    button: {
      textTransform: 'uppercase', // Caixa alta nos botões
      fontWeight: 'bold'
    }
  },
  // Padronização adicional
  shape: {
    borderRadius: 12
  },
  spacing: 8
})
