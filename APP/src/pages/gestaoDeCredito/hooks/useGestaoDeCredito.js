import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCombo } from '../../../features/combo'
import { useCommercial } from '../../../contexts/CommercialContext'

const readBranch = () => {
  const v = localStorage.getItem('selectedBranchId')
  return v && v !== 'null' && v !== '(TODAS)' ? v : ''
}

export const useGestaoDeCredito = () => {
  const form = useForm()
  const { control, handleSubmit, reset } = form

  const { fetchProductSuppliers, productSuppliers, fetchBranches, branches } = useCombo()
  const { loading, supplierMovement, buscaSupplierMovement, resetCommercial, setSupplierMovement } =
    useCommercial()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('invoiceNumber')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
  const [showParameters, setShowParameters] = useState(false)
  const [supplier, setSupplier] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [branchId, setBranchId] = useState(readBranch)
  const [openMovementModal, setOpenMovementModal] = useState(false)
  const [openObservationModal, setOpenObservationModal] = useState(false)
  const [observationSelect, setObservationSelect] = useState('')

  // ------- sorted + paginated -------
  const paginatedSupplierMovement = useMemo(() => {
    if (!supplierMovement?.length) return []
    return [...supplierMovement]
      .sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [supplierMovement, order, orderBy, page, rowsPerPage])

  const totalMovements = useMemo(
    () =>
      paginatedSupplierMovement.reduce((acc, m) => {
        const val = Number(m.movementValue) || 0
        return m.movementTypeId === 1 ? acc + val : m.movementTypeId === 2 ? acc - val : acc
      }, 0),
    [paginatedSupplierMovement]
  )

  const totalMovementsFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalMovements)

  // ------- handlers -------
  const toggleParameters = () => setShowParameters(prev => !prev)

  const handleLimpar = () => {
    setRowsPerPage(10)
    setPage(0)
    setSupplier('')
    setSupplierId('')
    reset()
    resetCommercial()
  }

  const onSubmit = data => {
    const savedBranch = localStorage.getItem('selectedBranchId')
    data.branchId =
      savedBranch && savedBranch !== 'null' && savedBranch !== '(TODAS)' ? savedBranch : null
    if (data.supplierId === 'todos') data.supplierId = null
    buscaSupplierMovement(data)
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

  const handleOpenObservationModal = observation => {
    setObservationSelect(observation ?? '')
    setOpenObservationModal(true)
  }
  const handleCloseObservationModal = () => {
    setObservationSelect('')
    setOpenObservationModal(false)
  }

  // ------- effects -------
  useEffect(() => {
    if (!productSuppliers) fetchProductSuppliers()
    if (!branches) fetchBranches()
  }, [])

  useEffect(() => () => setSupplierMovement([]), [])

  useEffect(() => {
    const sync = () => setBranchId(readBranch())
    sync()
    window.addEventListener('selectedBranchChanged', sync)
    return () => window.removeEventListener('selectedBranchChanged', sync)
  }, [])

  return {
    // form
    control, handleSubmit,
    // data
    productSuppliers, supplierMovement, loading,
    // state
    supplier, setSupplier, supplierId, setSupplierId, branchId,
    showParameters,
    openMovementModal, setOpenMovementModal,
    openObservationModal, observationSelect,
    order, orderBy, page, rowsPerPage,
    paginatedSupplierMovement, totalMovementsFormatted,
    // handlers
    toggleParameters, handleLimpar, onSubmit,
    handleRequestSort, handleChangePage, handleChangeRowsPerPage,
    handleOpenObservationModal, handleCloseObservationModal
  }
}
