import { Box, Card, TextField, Typography } from '@mui/material'
import { formatCurrency } from '../../../utils/formatters'

const StatCard = ({ label, value }) => (
  <Card sx={{ minHeight: 'auto' }}>
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Card>
)

export const DemoteSummaryCards = ({
  totalQuantitySold,
  totalSalePrice,
  totalProductCostPrice,
  totalDemotesCostValue,
  totalNewDemotesValue,
  calculatedMargin,
  supplier,
  condition,
  productSuppliers,
  salesConditions,
  paginatedDemotes,
  demotesAllValue,
  handleValorChangeAll
}) => {
  return (
    <>
      {/* 6 stat cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: 2
        }}>
        <StatCard label="Qtd. Total" value={`${totalQuantitySold} Un`} />
        <StatCard label="Tot. Venda" value={formatCurrency(totalSalePrice)} />
        <StatCard label="Custo Total" value={formatCurrency(totalProductCostPrice)} />
        <StatCard label="C. Rebaixa" value={formatCurrency(totalDemotesCostValue)} />
        <StatCard label="Tot. Rebaixa" value={formatCurrency(totalNewDemotesValue)} />
        <StatCard label="M. Calculada" value={`${calculatedMargin.toFixed(2)}%`} />
      </Box>

      {/* Supplier info + bulk input */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'flex-start' },
          gap: 2,
          py: 4
        }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, wordBreak: 'break-word' }}>
            <b>Fornecedor:</b> {supplier} –{' '}
            {productSuppliers.find(x => x.supplierId == supplier)?.supplier}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <b>Saldo Fornecedor:</b>{' '}
            {paginatedDemotes?.[0]?.supplierBalance?.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }) ?? '0.00'}
          </Typography>
          <Typography variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            <b>Condição:</b> {condition} –{' '}
            {salesConditions.find(x => x.id == condition)?.condition}
          </Typography>
        </Box>

        <Box sx={{ minWidth: { xs: '100%', md: '200px' } }}>
          <TextField
            value={demotesAllValue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            label="Rebaixa Todos"
            onChange={e => handleValorChangeAll(e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>
    </>
  )
}
