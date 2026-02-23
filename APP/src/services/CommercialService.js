import { getApiInstance } from './api'

const extractData = response => response.data

const handleRequest = async (requestFn, errorMessage) => {
  try {
    const response = await requestFn()
    return extractData(response)
  } catch (error) {
    console.error(errorMessage, error)
    throw error
  }
}

const PostSupplierMovement = async supplierMovement => {
  const api = getApiInstance()
  return handleRequest(
    () => api.post('/Commercial/SupplierMovement', supplierMovement),
    'Erro ao salvar movimentação de fornecedor'
  )
}

const GetSupplierMovement = async filters => {
  const api = getApiInstance()
  return handleRequest(
    () => api.get('/Commercial/SupplierMovement', { params: filters }),
    'Erro ao buscar movimentação de fornecedor'
  )
}

const PostDemotes = async demotes => {
  const api = getApiInstance()
  
  // Primeiro tenta POST (método mais comum para criação)
  try {
    console.log('Tentando POST para /Commercial/Demotes:', demotes)
    return await handleRequest(
      () => api.post('/Commercial/Demotes', demotes),
      'Erro ao salvar rebaixas via POST'
    )
  } catch (error) {
    console.warn('POST falhou, tentando PUT:', error.message)
    
    // Se POST falhar com 405, tenta PUT
    if (error.response?.status === 405) {
      console.log('Tentando PUT para /Commercial/Demotes:', demotes)
      return handleRequest(
        () => api.put('/Commercial/Demotes', demotes),
        'Erro ao salvar rebaixas via PUT'
      )
    }
    
    throw error
  }
}

const GetDemotes = async filters => {
  const api = getApiInstance()
  return handleRequest(
    () => api.get('/Commercial/Demotes', { params: filters }),
    'Erro ao buscar rebaixas'
  )
}

const GetConditionDemote = async params => {
  const api = getApiInstance()
  return handleRequest(
    () => api.get('/Commercial/ConditionDemotes', { params }),
    'Erro ao buscar condição de rebaixa'
  )
}

const PostConditionDemote = async conditionDemote => {
  const api = getApiInstance()
  const payload = [{
    ...conditionDemote,
    branchId: Number(conditionDemote.branchId),
    conditionId: Number(conditionDemote.conditionId),
    supplierId: Number(conditionDemote.supplierId)
  }]

  return handleRequest(
    () => api.post('/Commercial/ConditionDemotes', payload),
    'Erro ao enviar condição de rebaixa'
  )
}

// ===== ConditionItemDemotes (endpoints oficiais) =====
const sanitizeParams = obj => {
  if (!obj) return undefined
  const p = { ...obj }
  Object.keys(p).forEach(k => (p[k] === undefined || p[k] === null || p[k] === '') && delete p[k])
  return p
}

const GetConditionItemDemotes = async params => {
  const api = getApiInstance()
  const path = '/Commercial/ConditionItemDemotes'
  const data = await handleRequest(
    () => api.get(path, { params: sanitizeParams(params) }),
    'Erro ao buscar itens da condição de rebaixa'
  )
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return data }
  }
  return data
}

// Envia um ARRAY de itens (também aceita envelope e extrai .items)
const PostConditionItemDemotes = async (payloadOrItems) => {
  const api = getApiInstance()
  const path = '/Commercial/ConditionItemDemotes'

  let arrayPayload
  if (Array.isArray(payloadOrItems)) {
    arrayPayload = payloadOrItems
  } else if (payloadOrItems && Array.isArray(payloadOrItems.items)) {
    arrayPayload = payloadOrItems.items
  } else {
    throw new Error('PostConditionItemDemotes: payload inválido. Envie um array de itens ou { items: [] }.')
  }

  const data = await handleRequest(
    () => api.post(path, arrayPayload),
    'Erro ao enviar itens da condição de rebaixa'
  )
  if (typeof data === 'string') {
    try { return JSON.parse(data) } catch { return data }
  }
  return data
}

export const CommercialService = {
  GetDemotes,
  GetConditionDemote,
  GetSupplierMovement,
  PostSupplierMovement,
  PostDemotes,
  PostConditionDemote,
  // novos
  GetConditionItemDemotes,
  PostConditionItemDemotes
}
