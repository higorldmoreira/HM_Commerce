import { createContext, useContext } from 'react'
import { useComboData } from '../hooks/useComboData'

const ComboContext = createContext(null)

export const ComboProvider = ({ children }) => {
  const combo = useComboData()

  return <ComboContext.Provider value={combo}>{children}</ComboContext.Provider>
}

export const useCombo = () => {
  const context = useContext(ComboContext)

  if (!context) {
    throw new Error('useCombo must be used within a ComboProvider')
  }

  return context
}
