import { useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  debounce
} from '@mui/material'
import { Controller } from 'react-hook-form'
import * as s from '../styledGestaoDeRebaixa'
import { brazilianStates } from '../../../enums/utils'

export const DemoteFiltersBar = ({
  control,
  handleSubmit,
  onSubmit,
  productSuppliers,
  products,
  salesConditions,
  fetchProducts,
  setSupplierId
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <s.ParametersContainer>
        {/* Row 1: dates + condition */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 2
        }}>
          <Controller
            name="beginDate"
            control={control}
            defaultValue=""
            rules={{ required: 'Data inicio é obrigatória' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Data de início"
                type="date"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            defaultValue=""
            rules={{ required: 'Data final é obrigatória' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Data final"
                type="date"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <FormControl fullWidth>
            <Controller
              name="conditionId"
              control={control}
              rules={{ required: 'A condição de compra é obrigatória' }}
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <Autocomplete
                  multiple
                  options={salesConditions}
                  getOptionLabel={option => option?.condition || ''}
                  value={salesConditions.filter(c => field.value.includes(c.id))}
                  onChange={(_, selectedOptions) => {
                    field.onChange(selectedOptions.map(opt => opt.id))
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Condição de Compra"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
          </FormControl>
        </Box>

        {/* Row 2: state + supplier + product */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 2
        }}>
          <FormControl fullWidth>
            <InputLabel id="stateAcronym-label">Estado</InputLabel>
            <Controller
              name="stateAcronym"
              control={control}
              defaultValue="todos"
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="stateAcronym-label"
                  label="Estado"
                  value={field.value || 'todos'}
                  onChange={e => field.onChange(e.target.value)}>
                  <MenuItem value="todos">(Todos)</MenuItem>
                  {brazilianStates.map(acronym => (
                    <MenuItem key={acronym} value={acronym}>{acronym}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <Controller
              name="supplierId"
              control={control}
              rules={{ required: 'O fornecedor é obrigatório' }}
              defaultValue={null}
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={productSuppliers}
                  getOptionLabel={option => option?.supplier || ''}
                  value={productSuppliers.find(s => s.supplierId === field.value) || null}
                  onChange={(_, selectedOption) => {
                    const selectedId = selectedOption?.supplierId || null
                    field.onChange(selectedId)
                    setSupplierId(selectedId)
                    fetchProducts(selectedId)
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Fornecedor"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.supplierId === value.supplierId}
                />
              )}
            />
          </FormControl>

          {products && (
            <ProductAutocomplete control={control} products={products} />
          )}
        </Box>

        {/* Row 3: submit */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" type="submit" sx={{ minWidth: 120, px: 4 }}>
            Filtrar
          </Button>
        </Box>
      </s.ParametersContainer>
    </form>
  )
}

/** Lazy-filtered product autocomplete (kept local to avoid unnecessary re-renders) */
const ProductAutocomplete = ({ control, products }) => (
  <Controller
    name="productId"
    control={control}
    defaultValue={null}
    render={({ field, fieldState }) => {
      const [inputValue, setInputValue] = useState('')
      const [options, setOptions] = useState([])
      const [loading, setLoading] = useState(false)

      const debouncedFilter = useMemo(
        () =>
          debounce(value => {
            setLoading(true)
            const filtered = products?.filter(p =>
              p.product.toLowerCase().includes(value.toLowerCase())
            )
            setOptions((filtered ?? []).slice(0, 30))
            setLoading(false)
          }, 300),
        [products]
      )

      useEffect(() => { debouncedFilter(inputValue) }, [inputValue, debouncedFilter])
      useEffect(() => { setOptions((products ?? []).slice(0, 30)) }, [products])

      return (
        <Autocomplete
          options={options}
          getOptionLabel={option => option.product || ''}
          loading={loading}
          onInputChange={(_, value) => setInputValue(value)}
          onChange={(_, value) => field.onChange(value?.productId || null)}
          value={products?.find(p => p.productId === field.value) || null}
          renderInput={params => (
            <TextField
              {...params}
              label="Produto"
              variant="outlined"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.productId === value.productId}
        />
      )
    }}
  />
)
