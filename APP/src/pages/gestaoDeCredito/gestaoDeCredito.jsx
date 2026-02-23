import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  Grid,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Add, Close, Delete, DoNotDisturb } from '@mui/icons-material'
import { Controller } from 'react-hook-form'
import { PageContainer, SurfaceCard, ActionButton, FiltersPanel } from '../../components/ui'
import { MovementModal } from './components/movementeModal'
import { ObservationModal } from './components/observationModal'
import { MovementTable } from '../../components/business/MovementTable'
import { useGestaoDeCredito } from './hooks/useGestaoDeCredito'

export const GestaoDeCredito = () => {
  const {
    control, handleSubmit,
    productSuppliers, supplierMovement, loading,
    supplier, setSupplier, supplierId, setSupplierId, branchId,
    showParameters,
    openMovementModal, setOpenMovementModal,
    openObservationModal, observationSelect,
    page, rowsPerPage,
    paginatedSupplierMovement, totalMovementsFormatted,
    toggleParameters, handleLimpar, onSubmit,
    handleRequestSort, handleChangePage, handleChangeRowsPerPage,
    handleOpenObservationModal, handleCloseObservationModal
  } = useGestaoDeCredito()

  return (
    <PageContainer sx={{ backgroundColor: 'transparent', px: { xs: 2, sm: 3, md: 4 } }}>
      <MovementModal
        open={openMovementModal}
        onClose={() => setOpenMovementModal(false)}
        branchId={branchId}
        supplierId={supplierId}
      />
      <ObservationModal
        open={openObservationModal}
        onClose={handleCloseObservationModal}
        observation={observationSelect}
      />

      <Box sx={{ maxWidth: { xs: '95%', sm: '100%', md: '90%', lg: '95%' }, mx: 'auto', width: '100%' }}>
        <SurfaceCard sx={{ gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Gestão de Créditos
          </Typography>

          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              pb: '10px'
            }}>
            <ActionButton
              tone="primary"
              onClick={toggleParameters}
              startIcon={showParameters ? <Close /> : <FilterListIcon />}
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>
              Filtros
            </ActionButton>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ActionButton tone="secondary" startIcon={<Delete />} onClick={handleLimpar}>
                Limpar
              </ActionButton>
              <ActionButton
                tone="primary"
                startIcon={<Add />}
                disabled={!supplierId || supplierId === '' || !branchId || supplierId === 'todos'}
                onClick={() => setOpenMovementModal(true)}>
                Adicionar crédito
              </ActionButton>
            </Box>
          </Box>

          {/* Filters */}
          {showParameters && (
            <FiltersPanel sx={{ mb: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="supplierId"
                      control={control}
                      rules={{ required: 'O fornecedor é obrigatório' }}
                      defaultValue={null}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          options={productSuppliers || []}
                          getOptionLabel={option => option?.supplier || ''}
                          value={(productSuppliers || []).find(s => s.supplierId === field.value) || null}
                          onChange={(_, selectedOption) => {
                            const selectedId = selectedOption?.supplierId || null
                            field.onChange(selectedId)
                            setSupplier(selectedOption?.supplier ?? '')
                            setSupplierId(selectedId)
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Fornecedor"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.supplierId === value.supplierId
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <ActionButton
                      tone="primary"
                      type="submit"
                      disabled={!supplierId || supplierId === '' || supplierId === 'todos'}
                      fullWidth>
                      Filtrar
                    </ActionButton>
                  </Grid>
                </Grid>
              </form>
            </FiltersPanel>
          )}

          <Divider />

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ color: '#666' }}>Carregando dados...</Typography>
            </Box>
          )}

          {/* Empty */}
          {!loading && (!paginatedSupplierMovement || paginatedSupplierMovement.length === 0) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
              <DoNotDisturb fontSize="large" />
              <Typography variant="h6" sx={{ color: '#666', textAlign: 'center' }}>
                Nenhum crédito/débito encontrado para os filtros selecionados!
              </Typography>
            </Box>
          )}

          {/* Results */}
          {!loading && paginatedSupplierMovement && paginatedSupplierMovement.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1"><b>Fornecedor:</b> {supplier}</Typography>
                <Typography variant="subtitle1">
                  <b>Valor Crédito Líquido:</b> {totalMovementsFormatted}
                </Typography>
              </Box>

              <MovementTable
                movements={paginatedSupplierMovement}
                onObservationClick={handleOpenObservationModal}
              />

              <TablePagination
                component="div"
                count={supplierMovement?.length ?? 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página"
                rowsPerPageOptions={[10, 20, 50, 100, 200, 500, 1000, 2000]}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
                }
              />
            </Box>
          )}
        </SurfaceCard>
      </Box>
    </PageContainer>
  )
}
