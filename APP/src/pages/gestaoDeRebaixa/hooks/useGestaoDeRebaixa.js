import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCombo } from '../../../features/combo'
import { useCommercial } from '../../../contexts/CommercialContext'
import { exportToExcel } from '../../../utils/utilsExcel'

const readBranch = () => {
  const v = localStorage.getItem('selectedBranchId')
  return v && v !== 'null' && v !== '(TODAS)' ? v : ''
}

export const useGestaoDeRebaixa = () => {
  const form = useForm()
  const { control, handleSubmit, reset, watch } = form
  const supplier = watch('supplierId')
  const condition = watch('conditionId')

  const {
    fetchProductSuppliers, productSuppliers,
    fetchBranches, branches,
    fetchProducts, products,
    fetchSalesConditions, salesConditions
  } = useCombo()

  const { loading, resetCommercial, buscaDemotes, demotes, gravaDemotes, setDemotes } =
    useCommercial()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('invoiceNumber')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [showParameters, setShowParameters] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [branchId, setBranchId] = useState(readBranch)
  const [demotesAllValue, setDemotesAllValue] = useState(0)

  // ------- aggregate totals -------
  const totalQuantitySold = useMemo(
    () => (demotes ?? []).reduce((t, i) => t + (i.quantitySold ?? 0), 0),
    [demotes]
  )
  const totalSalePrice = useMemo(
    () => (demotes ?? []).reduce((t, i) => t + (i.salePrice ?? 0), 0),
    [demotes]
  )
  const totalProductCostPrice = useMemo(
    () => (demotes ?? []).reduce((t, i) => t + (i.averageCostPriceProduct ?? 0), 0),
    [demotes]
  )
  const totalDemotesCostValue = useMemo(
    () => (demotes ?? []).reduce((t, i) => t + (i.demotesCostValue ?? 0), 0),
    [demotes]
  )
  const totalNewDemotesValue = useMemo(
    () => (demotes ?? []).reduce((t, i) => t + (i.newDemotesValue ?? 0), 0),
    [demotes]
  )
  const calculatedMargin =
    totalSalePrice > 0
      ? ((totalProductCostPrice - totalNewDemotesValue) / totalSalePrice - 1) * -1 * 100
      : 0

  // ------- sorted + paginated -------
  const paginatedDemotes = useMemo(() => {
    if (!demotes?.length) return []
    return [...demotes]
      .sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [demotes, order, orderBy, page, rowsPerPage])

  // ------- handlers -------
  const handleValorChangeAll = value => {
    const soNumeros = value.replace(/\D/g, '')
    const valorNumerico = Number(soNumeros) / 100
    setDemotesAllValue(valorNumerico)

    const novosDados = demotes.map(item => {
      const demotesCostValueUnit = item.averageCostPriceProductUnit - valorNumerico
      const newMarginUnit = (demotesCostValueUnit / item.salePriceUnit - 1) * -1 * 100
      return {
        ...item,
        demotesValueUnit: valorNumerico,
        newDemotesValue: valorNumerico * item.quantitySold,
        demotesCostValueUnit,
        demotesCostValue: demotesCostValueUnit * item.quantitySold,
        newMarginUnit,
        items: item.items.map(invoice => {
          const invoiceCost = invoice.averageCostPriceProductUnit - valorNumerico
          const invoiceMargin = (invoiceCost / invoice.salePriceUnit - 1) * -1 * 100
          return {
            ...invoice,
            demotesValueUnit: valorNumerico,
            newDemotesValue: valorNumerico * invoice.quantitySold,
            demotesCostValueUnit: invoiceCost,
            demotesCostValue: invoiceCost * item.quantitySold,
            newMarginUnit: invoiceMargin
          }
        })
      }
    })
    setDemotes(novosDados)
  }

  const toggleParameters = () => setShowParameters(prev => !prev)

  const handleLimpar = () => {
    setRowsPerPage(10)
    setPage(0)
    setSupplierId('')
    setBranchId('')
    reset()
    resetCommercial()
  }

  const onSubmit = data => {
    const savedBranch = localStorage.getItem('selectedBranchId')
    if (savedBranch && savedBranch !== 'null' && savedBranch !== '(TODAS)')
      data.branchId = savedBranch
    if (data.stateAcronym === 'todos') data.stateAcronym = null
    if (data.conditionId) data.conditionId = data.conditionId.join(',')
    buscaDemotes(data)
    setDemotesAllValue(0)
    toggleParameters()
  }

  const handleRequestSort = property => {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const buildPayloadItems = () => {
    const payload = []
    demotes?.forEach(demote => {
      if (demote?.newDemotesValue > 0) {
        demote.items.forEach(invoice => {
          payload.push({
            ...invoice,
            demotesValue: invoice.newDemotesValue,
            demotesDifferenceValue: invoice.newDemotesValue - invoice.demotesValue,
            typistName: localStorage.getItem('username')
          })
        })
      }
    })
    return payload
  }

  const handleSaveChanges = () => gravaDemotes(buildPayloadItems())

  const handleExportExcel = () => {
    const payload = []
    demotes?.forEach(demote => {
      demote.items.forEach(invoice => {
        payload.push({
          ...invoice,
          demotesValue: invoice.newDemotesValue,
          demotesDifferenceValue: invoice.newDemotesValue - invoice.demotesValue,
          typistName: localStorage.getItem('username')
        })
      })
    })
    exportToExcel(payload, 'lista-rebaixas')
  }

  // ------- effects -------
  useEffect(() => {
    if (!productSuppliers) fetchProductSuppliers()
    if (!branches) fetchBranches()
    if (!salesConditions) fetchSalesConditions()
  }, [])

  useEffect(() => () => setDemotes([]), [])

  useEffect(() => {
    const sync = () => setBranchId(readBranch())
    sync()
    window.addEventListener('selectedBranchChanged', sync)
    return () => window.removeEventListener('selectedBranchChanged', sync)
  }, [])

  return {
    // form
    control, handleSubmit, form,
    supplier, condition,
    // combo data
    productSuppliers, products, salesConditions,
    fetchProducts, setSupplierId,
    // state
    loading, demotes, supplierId, branchId,
    showParameters, demotesAllValue,
    order, orderBy, page, rowsPerPage,
    // totals
    totalQuantitySold, totalSalePrice, totalProductCostPrice,
    totalDemotesCostValue, totalNewDemotesValue, calculatedMargin,
    // paginated
    paginatedDemotes,
    // handlers
    handleValorChangeAll, toggleParameters, handleLimpar, onSubmit,
    handleRequestSort, handleChangePage, handleChangeRowsPerPage,
    handleSaveChanges, handleExportExcel,
    setDemotes
  }
}
