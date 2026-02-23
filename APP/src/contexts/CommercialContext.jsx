import React, { createContext, useContext, useState } from 'react'
import { CommercialService } from '../services/CommercialService'
import { useFeedback } from './FeedbackContext'

const CommercialContext = createContext()

export const CommercialProvider = ({ children }) => {
  const [supplierMovement, setSupplierMovement] = useState([])
  const [demotes, setDemotes] = useState([])
  const [loading, setLoading] = useState(false)

  const { showMessage } = useFeedback()

  const resetCommercial = () => {
    setSupplierMovement([])
    setDemotes([])
  }

  const buscaSupplierMovement = async filters => {
    setSupplierMovement([])
    setLoading(true)
    try {
      const response = await CommercialService.GetSupplierMovement(filters)
      setSupplierMovement(response)
      return response
    } catch (error) {
      setSupplierMovement([])
      throw error
    } finally {
      setLoading(false)
    }
  }

  const gravaSupplierMovement = async payload => {
    setLoading(true)
    try {
      await CommercialService.PostSupplierMovement(payload)
      showMessage('Cadastro de crédito/débito realizado!', 'success')
      setSupplierMovement([])
    } catch (error) {
      showMessage('Erro ao cadastrar crédito/débito! Contate o Suporte!', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const buscaDemotes = async filters => {
    setDemotes([])
    setLoading(true)
    try {
      const response = await CommercialService.GetDemotes(filters)
      setDemotes(response)
      return response
    } catch (error) {
      setDemotes([])
      throw error
    } finally {
      setLoading(false)
    }
  }

  const gravaDemotes = async payload => {
    setLoading(true)
    try {
      await CommercialService.PostDemotes(payload)
      showMessage('Salvamento de rebaixa realizado!', 'success')
      setDemotes([])
    } catch (error) {
      showMessage('Erro ao salvar rebaixa! Contate o Suporte!', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const criaCondicaoRebaixa = async payload => {
    setLoading(true)
    try {
      const data = await CommercialService.PostConditionDemote(payload)

      const isSuccess = (Array.isArray(data) && data.length === 0) ||
        (Array.isArray(data) && data.length > 0 && data[0]?.isValid === true)

      if (isSuccess) {
        return data
      }

      if (Array.isArray(data) && data.length > 0) {
        const result = data[0]
        if (result.isValid === false || (result.erros && result.erros.length > 0)) {
          const errorMessage = result.erros?.map(e => e.message).join('; ') || 'Erro de validação desconhecido.'
          throw new Error(errorMessage)
        }
      }

      throw new Error('Formato de resposta inesperado da API.')
    } catch (error) {
      console.error('Erro em criaCondicaoRebaixa:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <CommercialContext.Provider
      value={{
        loading,
        supplierMovement,
        demotes,
        buscaSupplierMovement,
        gravaSupplierMovement,
        resetCommercial,
        buscaDemotes,
        setDemotes,
        gravaDemotes,
        setSupplierMovement,
        criaCondicaoRebaixa
      }}>
      {children}
    </CommercialContext.Provider>
  )
}

export const useCommercial = () => useContext(CommercialContext)
