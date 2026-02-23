import { Box, CircularProgress, Divider, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Calculate, Close, Delete, DoNotDisturb, Save } from '@mui/icons-material'
import { PageContainer, SurfaceCard, ActionButton } from '../../components/ui'
import { useGestaoDeRebaixa } from './hooks/useGestaoDeRebaixa'
import { DemoteFiltersBar } from './components/DemoteFiltersBar'
import { DemoteSummaryCards } from './components/DemoteSummaryCards'
import { DemoteTable } from './components/DemoteTable'

// Re-export so external imports of RowCustom from this module still work
export { RowCustom } from './components/RowCustom'

export const GestaoDeRebaixa = () => {
  const {
    control, handleSubmit,
    supplier, condition,
    productSuppliers, products, salesConditions,
    fetchProducts, setSupplierId,
    loading, demotes,
    showParameters, demotesAllValue,
    order, orderBy, page, rowsPerPage,
    totalQuantitySold, totalSalePrice, totalProductCostPrice,
    totalDemotesCostValue, totalNewDemotesValue, calculatedMargin,
    paginatedDemotes,
    handleValorChangeAll, toggleParameters, handleLimpar, onSubmit,
    handleRequestSort, handleChangePage, handleChangeRowsPerPage,
    handleSaveChanges, handleExportExcel
  } = useGestaoDeRebaixa()

  return (
    <PageContainer sx={{ backgroundColor: 'transparent', px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <SurfaceCard sx={{ gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Gestão de Rebaixa
          </Typography>

          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              pt: '10px',
              pb: '10px'
            }}>
            <ActionButton
              tone="primary"
              onClick={toggleParameters}
              startIcon={showParameters ? <Close /> : <FilterListIcon />}>
              Filtros
            </ActionButton>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ActionButton tone="secondary" startIcon={<Calculate />} onClick={handleExportExcel}>
                Exportar
              </ActionButton>
              <ActionButton tone="secondary" startIcon={<Delete />} onClick={handleLimpar}>
                Limpar
              </ActionButton>
              <ActionButton
                tone="primary"
                disabled={totalNewDemotesValue === 0}
                startIcon={<Save />}
                onClick={handleSaveChanges}>
                Salvar
              </ActionButton>
            </Box>
          </Box>

          {/* Filters */}
          {showParameters && (
            <DemoteFiltersBar
              control={control}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              productSuppliers={productSuppliers ?? []}
              products={products}
              salesConditions={salesConditions ?? []}
              fetchProducts={fetchProducts}
              setSupplierId={setSupplierId}
            />
          )}

          <Divider />

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Empty */}
          {!loading && (!paginatedDemotes || paginatedDemotes.length === 0) && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, pt: 2 }}>
              <DoNotDisturb fontSize="large" />
              <Typography variant="h5">
                Nenhum resultado encontrado para os filtros selecionados!
              </Typography>
            </Box>
          )}

          {/* Results */}
          {!loading && paginatedDemotes && paginatedDemotes.length > 0 && (
            <>
              <DemoteSummaryCards
                totalQuantitySold={totalQuantitySold}
                totalSalePrice={totalSalePrice}
                totalProductCostPrice={totalProductCostPrice}
                totalDemotesCostValue={totalDemotesCostValue}
                totalNewDemotesValue={totalNewDemotesValue}
                calculatedMargin={calculatedMargin}
                supplier={supplier}
                condition={condition}
                productSuppliers={productSuppliers ?? []}
                salesConditions={salesConditions ?? []}
                paginatedDemotes={paginatedDemotes}
                demotesAllValue={demotesAllValue}
                handleValorChangeAll={handleValorChangeAll}
              />
              <DemoteTable
                paginatedDemotes={paginatedDemotes}
                demotesTotal={demotes?.length ?? 0}
                order={order}
                orderBy={orderBy}
                page={page}
                rowsPerPage={rowsPerPage}
                handleRequestSort={handleRequestSort}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </>
          )}
        </SurfaceCard>
      </Box>
    </PageContainer>
  )
}
