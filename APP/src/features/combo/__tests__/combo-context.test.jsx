import { renderHook, act } from '@testing-library/react'
import { comboService } from '../services/combo-service'
import { ComboProvider, useCombo } from '../context/ComboContext'

vi.mock('../services/combo-service', () => ({
  comboService: {
    fetchBranches: vi.fn(),
    fetchProductSuppliers: vi.fn(),
    fetchProducts: vi.fn(),
    fetchSalesConditions: vi.fn(),
    fetchConditionDemotions: vi.fn(),
    fetchRebateConditions: vi.fn()
  }
}))

describe('ComboContext', () => {
  const renderCombo = () =>
    renderHook(() => useCombo(), {
      wrapper: ({ children }) => <ComboProvider>{children}</ComboProvider>
    })

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('fetches branches and updates state', async () => {
    const branches = [{ branchId: 1, branch: 'Headquarters' }]
    comboService.fetchBranches.mockResolvedValueOnce(branches)
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchBranches()
    })

    expect(response).toEqual(branches)
    expect(result.current.branches).toEqual(branches)
    expect(comboService.fetchBranches).toHaveBeenCalledTimes(1)
  })

  it('fetches product suppliers and updates state', async () => {
    const suppliers = [{ supplierId: 10, supplier: 'Supplier' }]
    comboService.fetchProductSuppliers.mockResolvedValueOnce(suppliers)
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchProductSuppliers()
    })

    expect(response).toEqual(suppliers)
    expect(result.current.productSuppliers).toEqual(suppliers)
    expect(comboService.fetchProductSuppliers).toHaveBeenCalledTimes(1)
  })

  it('fetches products by supplier and updates state', async () => {
    const supplierId = 5
    const products = [{ productId: 99, description: 'Product' }]
    comboService.fetchProducts.mockResolvedValueOnce(products)
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchProducts(supplierId)
    })

    expect(response).toEqual(products)
    expect(result.current.products).toEqual(products)
    expect(comboService.fetchProducts).toHaveBeenCalledWith(supplierId)
  })

  it('fetches sales conditions using sanitized branch id from localStorage', async () => {
    localStorage.setItem('selectedBranchId', '(TODAS)')
    const conditions = [{ id: 1 }]
    comboService.fetchSalesConditions.mockResolvedValueOnce(conditions)
    const { result } = renderCombo()

    await act(async () => {
      await result.current.fetchSalesConditions()
    })

    expect(comboService.fetchSalesConditions).toHaveBeenCalledWith(null)
    expect(result.current.salesConditions).toEqual(conditions)
  })

  it('fetches sales conditions with valid stored branch id', async () => {
    localStorage.setItem('selectedBranchId', ' 123 ')
    const conditions = [{ id: 2 }]
    comboService.fetchSalesConditions.mockResolvedValueOnce(conditions)
    const { result } = renderCombo()

    await act(async () => {
      await result.current.fetchSalesConditions()
    })

    expect(comboService.fetchSalesConditions).toHaveBeenCalledWith('123')
    expect(result.current.salesConditions).toEqual(conditions)
  })

  it('defaults to empty array when demotion conditions response is invalid', async () => {
    comboService.fetchConditionDemotions.mockResolvedValueOnce({})
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchDemotionConditions({})
    })

    expect(response).toEqual([])
    expect(result.current.demotionConditions).toEqual([])
  })

  it('returns empty array when demotion conditions request fails', async () => {
    comboService.fetchConditionDemotions.mockRejectedValueOnce(new Error('fail'))
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchDemotionConditions({ branchId: '(TODAS)' })
    })

    expect(comboService.fetchConditionDemotions).toHaveBeenCalledWith(null, null, null)
    expect(response).toEqual([])
    expect(result.current.demotionConditions).toEqual([])
  })

  it('fetches rebate conditions and updates state', async () => {
    const data = [{ id: 3 }]
    comboService.fetchRebateConditions.mockResolvedValueOnce(data)
    const { result } = renderCombo()

    let response
    await act(async () => {
      response = await result.current.fetchRebateConditions()
    })

    expect(response).toEqual(data)
    expect(result.current.rebateConditions).toEqual(data)
  })
})
