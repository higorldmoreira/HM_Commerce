import { useCallback, useMemo, useState } from 'react'
import { comboService } from '../services/combo-service'
import { sanitizeBranchId } from '../utils/sanitizeBranchId'

const ensureArray = value => (Array.isArray(value) ? value : [])

export const useComboData = () => {
  const [branches, setBranches] = useState(null)
  const [productSuppliers, setProductSuppliers] = useState(null)
  const [products, setProducts] = useState(null)
  const [salesConditions, setSalesConditions] = useState(null)
  const [demotionConditions, setDemotionConditions] = useState([])
  const [rebateConditions, setRebateConditions] = useState(null)

  const fetchBranches = useCallback(async () => {
    const data = await comboService.fetchBranches()
    setBranches(data)
    return data
  }, [])

  const fetchProductSuppliers = useCallback(async () => {
    const data = await comboService.fetchProductSuppliers()
    setProductSuppliers(data)
    return data
  }, [])

  const fetchProducts = useCallback(async supplierId => {
    const data = await comboService.fetchProducts(supplierId)
    setProducts(data)
    return data
  }, [])

  const fetchSalesConditions = useCallback(async () => {
    const storedBranchId = localStorage.getItem('selectedBranchId')
    const branchId = sanitizeBranchId(storedBranchId)
    const data = await comboService.fetchSalesConditions(branchId)
    setSalesConditions(data)
    return data
  }, [])

  const fetchDemotionConditions = useCallback(async (filters = {}) => {
    const branchId = sanitizeBranchId(filters.branchId) ?? null
    const supplierId = filters.supplierId ?? null
    const conditionId = filters.conditionId ?? null

    try {
      const response = await comboService.fetchConditionDemotions(branchId, supplierId, conditionId)
      const safeData = ensureArray(response)
      setDemotionConditions(safeData)
      return safeData
    } catch (error) {
      console.error('Failed to load demotion conditions', error)
      setDemotionConditions([])
      return []
    }
  }, [])

  const fetchRebateConditions = useCallback(async () => {
    const data = await comboService.fetchRebateConditions()
    setRebateConditions(data)
    return data
  }, [])

  return useMemo(
    () => ({
      branches,
      productSuppliers,
      products,
      salesConditions,
      demotionConditions,
      rebateConditions,
      fetchBranches,
      fetchProductSuppliers,
      fetchProducts,
      fetchSalesConditions,
      fetchDemotionConditions,
      fetchRebateConditions,
      setDemotionConditions
    }),
    [
      branches,
      productSuppliers,
      products,
      salesConditions,
      demotionConditions,
      rebateConditions,
      fetchBranches,
      fetchProductSuppliers,
      fetchProducts,
      fetchSalesConditions,
      fetchDemotionConditions,
      fetchRebateConditions
    ]
  )
}
