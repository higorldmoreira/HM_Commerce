import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material'
import * as s from '../styledGestaoDeRebaixa'
import { RowCustom } from './RowCustom'

const COLUMNS = [
  { id: 'productName', label: 'Produto' },
  { id: 'quantitySold', label: 'Qtd.' },
  { id: 'salePriceUnit', label: 'Valor Unit.' },
  { id: 'salePrice', label: 'Valor Total' },
  { id: 'averageCostPriceProductUnit', label: 'Custo Médio' },
  { id: 'demotesCostValueUnit', label: 'Custo Rebaixa' },
  { id: 'demotesValueUnit', label: 'Rebaixa' },
  { id: 'currentMargin', label: 'M. Atual (%)' },
  { id: 'newMarginUnit', label: 'M. Rebaixa (%)' }
]

export const DemoteTable = ({
  paginatedDemotes,
  demotesTotal,
  order,
  orderBy,
  page,
  rowsPerPage,
  handleRequestSort,
  handleChangePage,
  handleChangeRowsPerPage
}) => {
  return (
    <>
      <s.TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
              <TableCell />
              {COLUMNS.map(col => (
                <TableCell
                  key={col.id}
                  sortDirection={orderBy === col.id ? order : false}
                  style={{ whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleRequestSort(col.id)}>
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDemotes?.map((invoicePayment, index) => (
              <RowCustom
                invoicePayment={invoicePayment}
                key={
                  invoicePayment.productId ??
                  invoicePayment.invoiceId ??
                  invoicePayment.invoiceNumber ??
                  `${invoicePayment.supplierId ?? 'sup'}-${index}`
                }
              />
            ))}
          </TableBody>
        </Table>
      </s.TableContainer>

      <TablePagination
        component="div"
        count={demotesTotal ?? 0}
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
    </>
  )
}
