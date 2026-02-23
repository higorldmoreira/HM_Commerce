import { useState } from 'react'
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useCommercial } from '../../../contexts/CommercialContext'
import { format, parseISO } from 'date-fns'
import { formatCurrency } from '../../../utils/formatters'

export const RowCustom = ({ invoicePayment }) => {
  const { demotes, setDemotes } = useCommercial()
  const [open, setOpen] = useState(false)

  const handleValorChange = (salePriceUnitKey, value) => {
    const soNumeros = value.replace(/\D/g, '')
    const valorNumerico = Number(soNumeros) / 100

    const novosDados = demotes.map(item => {
      if (item.salePriceUnit !== salePriceUnitKey) return item

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

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>{invoicePayment.productName}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>{invoicePayment.quantitySold}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {formatCurrency(invoicePayment.salePriceUnit)}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {formatCurrency(invoicePayment.salePrice)}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {formatCurrency(invoicePayment.averageCostPriceProductUnit)}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', color: 'green' }}>
          {formatCurrency(invoicePayment.demotesCostValueUnit)}
        </TableCell>
        <TableCell>
          <TextField
            value={invoicePayment.demotesValueUnit.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            onChange={e => handleValorChange(invoicePayment.salePriceUnit, e.target.value)}
            variant="standard"
            inputProps={{ style: { textAlign: 'right', color: 'blue' } }}
          />
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {invoicePayment.currentMarginUnit}%
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', color: 'green' }}>
          {invoicePayment.newMarginUnit.toFixed(2)}%
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={9} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    {['NF', 'Data', 'Qtd.', 'V. Un', 'V. Tot', 'C. Médio', 'C. Rebaixa', 'Rebaixa', 'M. Atual', 'M. Rebaixa'].map(h => (
                      <TableCell key={h} sx={{ color: 'primary.contrastText' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicePayment.items.map((invoice, index) => (
                    <TableRow key={invoice.invoiceId ?? invoice.invoiceNumber ?? `${invoice.productId ?? 'prod'}-${index}`}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{format(parseISO(invoice.invoiceIssueDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{invoice.quantitySold}</TableCell>
                      <TableCell>{formatCurrency(invoice.salePriceUnit)}</TableCell>
                      <TableCell>{formatCurrency(invoice.salePrice)}</TableCell>
                      <TableCell>{formatCurrency(invoice.averageCostPriceProductUnit)}</TableCell>
                      <TableCell>{formatCurrency(invoice.demotesCostValueUnit)}</TableCell>
                      <TableCell>{formatCurrency(invoice.demotesValueUnit)}</TableCell>
                      <TableCell>{invoicePayment.currentMarginUnit.toFixed(2)}%</TableCell>
                      <TableCell>{invoicePayment.newMarginUnit.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
