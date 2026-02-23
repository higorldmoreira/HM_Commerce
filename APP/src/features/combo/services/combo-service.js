import { getApiInstance } from '../../../services/api'

const extractData = response => response?.data

const logError = (message, error) => {
  console.error(message, error)
}

const fetchBranches = async () => {
  const api = getApiInstance()
  try {
    const response = await api.get('/ComboBox/Branches')
    return extractData(response)
  } catch (error) {
    logError('Failed to load branches', error)
    throw error
  }
}

const fetchProductSuppliers = async () => {
  const api = getApiInstance()
  try {
    const response = await api.get('/ComboBox/ProductSuppliers')
    return extractData(response)
  } catch (error) {
    logError('Failed to load product suppliers', error)
    throw error
  }
}

const fetchProducts = async supplierId => {
  if (!supplierId) {
    return []
  }

  const api = getApiInstance()
  try {
    const response = await api.get(`/ComboBox/Products?supplierId=${supplierId}`)
    return extractData(response)
  } catch (error) {
    logError('Failed to load products for supplier', error)
    throw error
  }
}

const fetchSalesConditions = async branchId => {
  const api = getApiInstance()
  const isValidBranch = branchId !== null && branchId !== undefined && branchId !== 'null' && branchId !== '(TODAS)'
  const params = isValidBranch ? `?branchId=${Number(branchId)}` : ''

  try {
    const response = await api.get(`/ComboBox/SalesCondition${params}`)
    return extractData(response)
  } catch (error) {
    logError('Failed to load sales conditions', error)
    throw error
  }
}

const fetchConditionDemotions = async (branchId = null, supplierId = null, conditionId = null) => {
  const api = getApiInstance()
  const searchParams = new URLSearchParams()

  if (branchId && branchId !== '(TODAS)' && branchId !== 'null') searchParams.append('branchId', Number(branchId))
  if (supplierId) searchParams.append('supplierId', Number(supplierId))
  if (conditionId) searchParams.append('conditionId', Number(conditionId))

  const query = searchParams.toString()
  const url = query ? `/Commercial/ConditionDemotes?${query}` : '/Commercial/ConditionDemotes'

  try {
    const response = await api.get(url)
    return extractData(response) || []
  } catch (error) {
    const data = error.response?.data
    const isSqlOverflow = typeof data === 'string' && data.includes('SqlDateTime overflow')

    if (isSqlOverflow) {
      console.warn('SqlDateTime overflow detected, returning empty list')
      return []
    }

    logError('Failed to load demotion conditions', error)
    throw error
  }
}

const fetchRebateConditions = async () => {
  const api = getApiInstance()
  try {
    const response = await api.get('/ComboBox/SalesCondition')
    return extractData(response)
  } catch (error) {
    logError('Failed to load rebate conditions', error)
    throw error
  }
}

export const comboService = {
  fetchBranches,
  fetchProductSuppliers,
  fetchProducts,
  fetchSalesConditions,
  fetchConditionDemotions,
  fetchRebateConditions
}
