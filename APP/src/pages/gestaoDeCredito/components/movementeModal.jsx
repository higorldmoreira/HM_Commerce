import React, { useRef } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { formatCurrency } from '../../../utils/formatters'
import { useCommercial } from '../../../contexts/CommercialContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
}

const sanitizeRawCurrency = value => {
  if (value === null || value === undefined) {
    return ''
  }

  let normalized = value.toString().trim()

  if (!normalized) {
    return ''
  }

  normalized = normalized.replace(/\s/g, '')
  const endsWithComma = normalized.endsWith(',')
  normalized = normalized.replace(/[R$r$]/gi, '')
  normalized = normalized.replace(/\./g, '')
  normalized = normalized.replace(/[^0-9,]/g, '')

  if (!normalized) {
    return ''
  }

  const [integerPart = '', decimalPartRaw = ''] = normalized.split(',')
  const integerNormalized = integerPart.replace(/^0+(?=\d)/, '')
  const safeInteger = integerNormalized || (decimalPartRaw ? '0' : integerPart)
  const decimalPart = decimalPartRaw ? decimalPartRaw.slice(0, 2) : ''

  if (endsWithComma && !decimalPart) {
    return `${safeInteger || '0'},`
  }

  return decimalPart ? `${safeInteger || '0'},${decimalPart}` : safeInteger || ''
}

export const MovementModal = ({ open, onClose, branchId, supplierId }) => {
  const { gravaSupplierMovement, loading } = useCommercial()
  const movementValueInputRef = useRef(null)

  const defaultValues = {
    movementValue: '',
    movementType: '',
    depositDate: '',
    observation: ''
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues
  })

  const parseCurrencyToNumber = value => {
    // Converte o valor digitado em número, interpretando dígitos puros como centavos
    // Ex.: '150' -> 1.50; '1,5' -> 1.5; '1,50' -> 1.5
    if (value === null || value === undefined || value === '') return 0
    if (typeof value === 'number') return value

    const str = value.toString().trim()
    if (!str) return 0

    // Se o usuário digitou somente dígitos, tratamos como centavos
    if (/^\d+$/.test(str)) {
      const cents = Number(str)
      return Number.isNaN(cents) ? 0 : cents / 100
    }

    // Caso haja vírgula/ponto, normaliza para ponto decimal e converte
    const sanitized = str
      .replace(/[^0-9,-]/g, '')
      .replace(',', '.')

    const numeric = Number(sanitized)
    return Number.isNaN(numeric) ? 0 : numeric
  }

  const formatCurrencyInput = value => {
    if (value === null || value === undefined || value === '') return ''
    const numeric = parseCurrencyToNumber(value)
    return formatCurrency(numeric)
  }

  const today = new Date().toISOString()

  const handleClose = () => {
    // Zera o formulário sempre que o modal é fechado
    reset(defaultValues)
    onClose && onClose()
  }

  const handleFormSubmit = data => {
    const payload = [
      {
        branchId: branchId,
        supplierId: supplierId,
        movementTypeId: Number(data.movementType),
        movementValue: parseCurrencyToNumber(data.movementValue),
        depositDate: data.depositDate + 'T00:00:00.769Z',
        registrationDate: today,
        typistName: localStorage.getItem('username'),
        observation: data.observation
      }
    ]

    gravaSupplierMovement(payload)
    handleClose()
  }

  return (
  <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Nova Movimentação
        </Typography>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Controller
            name="movementValue"
            control={control}
            rules={{ required: 'O valor é obrigatório' }}
            render={({ field, fieldState }) => {

              const rawValue = field.value ?? ''

              const formattedValue = rawValue ? formatCurrencyInput(rawValue) : ''



              const setCursorToEnd = () => {

                const input = movementValueInputRef.current

                if (input && typeof input.setSelectionRange === 'function') {

                  const length = input.value.length

                  input.setSelectionRange(length, length)

                }

              }



              const handleValueChange = nextValue => {

                const sanitized = sanitizeRawCurrency(nextValue)

                field.onChange(sanitized)

                if (typeof window !== 'undefined') {

                  window.requestAnimationFrame(setCursorToEnd)

                }

              }



              const handleDigitInsertion = digit => {

                const [integerPart = '', decimalsPart = ''] = (rawValue || '').split(',')

                if (rawValue && rawValue.includes(',')) {

                  if (decimalsPart.length >= 2) {

                    return

                  }

                  handleValueChange(`${integerPart},${decimalsPart}${digit}`)

                  return

                }

                const nextInteger = `${integerPart}${digit}`.replace(/^0+(?=\d)/, '')

                handleValueChange(nextInteger)

              }



              const handleKeyDown = event => {

                const { key, ctrlKey, metaKey, altKey } = event



                if (ctrlKey || metaKey || altKey) {

                  return

                }



                if (

                  key === 'Tab' ||

                  key === 'Shift' ||

                  key === 'ArrowLeft' ||

                  key === 'ArrowRight' ||

                  key === 'ArrowUp' ||

                  key === 'ArrowDown' ||

                  key === 'Home' ||

                  key === 'End' ||

                  key === 'Enter' ||

                  key === 'Escape'

                ) {

                  return

                }



                if (key === 'Backspace' || key === 'Delete') {

                  event.preventDefault()

                  if (!rawValue) {

                    handleValueChange('')

                    return

                  }

                  handleValueChange(rawValue.slice(0, -1))

                  return

                }



                if (key === ',' || key === '.') {

                  event.preventDefault()

                  if (!rawValue.includes(',')) {

                    const base = rawValue === '' ? '0,' : `${rawValue},`

                    handleValueChange(base)

                  }

                  return

                }



                if (/^[0-9]$/.test(key)) {

                  event.preventDefault()

                  handleDigitInsertion(key)

                  return

                }



                event.preventDefault()

              }



              const handleBlur = () => {

                if (!rawValue) {

                  return

                }

                const numeric = parseCurrencyToNumber(rawValue)

                const normalized = numeric.toFixed(2).replace('.', ',')

                handleValueChange(normalized)

              }



              const handlePaste = event => {

                event.preventDefault()

                const pasted = event.clipboardData.getData('text') ?? ''

                handleValueChange(pasted)

              }



              const handleFocus = () => {

                if (typeof window !== 'undefined') {

                  window.requestAnimationFrame(setCursorToEnd)

                }

              }



              return (

                <TextField

                  label="Valor da Movimentação"

                  value={formattedValue}

                  onKeyDown={handleKeyDown}

                  onBlur={handleBlur}

                  onPaste={handlePaste}

                  onFocus={handleFocus}

                  fullWidth

                  error={!!fieldState.error}

                  helperText={fieldState.error?.message}

                  inputRef={movementValueInputRef}

                  inputProps={{ inputMode: 'decimal' }}

                />

              )

            }}

          />







          <FormControl fullWidth>
            <InputLabel id="movementType-label">Tipo de Movimentação</InputLabel>
            <Controller
              name="movementType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} labelId="movementType-label" label="Tipo de Movimentação">
                  <MenuItem value="1">Crédito</MenuItem>
                  <MenuItem value="2">Débito</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <Controller
            name="depositDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Data do Depósito"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="observation"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Observação" type="text" multiline rows={3} fullWidth />
            )}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {loading ? 'Salvando ...' : 'Salvar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
