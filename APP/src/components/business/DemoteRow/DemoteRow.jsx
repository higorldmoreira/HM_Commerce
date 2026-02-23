import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  TextField,
  Chip
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  TrendingDown
} from '@mui/icons-material';
import { useCommercial } from '../../../contexts/CommercialContext';
import { formatCurrency, formatPercentFixed } from '../../../utils/formatters';
import { parseCurrencyToNumber, formatCurrencyInput } from '../../../utils/currency';
import { calculateMarginUnit, calculateCostWithDemote } from '../../../utils/calculations';
import { DemoteRowDetails } from './DemoteRowDetails';

/**
 * DemoteRow - Linha de tabela para produtos com rebaixa
 * @param {Object} props - Props do componente
 * @param {Object} props.invoicePayment - Dados do produto
 * @param {Function} props.onValueChange - Callback para mudança de valor
 */
export const DemoteRow = ({ invoicePayment, onValueChange }) => {
  const { demotes, setDemotes } = useCommercial();
  const [open, setOpen] = React.useState(false);

  const handleValorChange = (salePriceUnitKey, value) => {
    const valorNumerico = parseCurrencyToNumber(value);

    const novosDados = demotes.map(item => {
      if (item.salePriceUnit !== salePriceUnitKey) return item;

      const demotesCostValueUnit = calculateCostWithDemote(
        item.averageCostPriceProductUnit,
        valorNumerico
      );
      const newMarginUnit = calculateMarginUnit(
        demotesCostValueUnit,
        item.salePriceUnit
      );

      return {
        ...item,
        demotesValueUnit: valorNumerico,
        newDemotesValue: valorNumerico * item.quantitySold,
        demotesCostValueUnit,
        demotesCostValue: demotesCostValueUnit * item.quantitySold,
        newMarginUnit,
        items: (item.items ?? []).map(invoice => {
          const invoiceCost = calculateCostWithDemote(
            invoice.averageCostPriceProductUnit,
            valorNumerico
          );
          const invoiceMargin = calculateMarginUnit(
            invoiceCost,
            invoice.salePriceUnit
          );

          return {
            ...invoice,
            demotesValueUnit: valorNumerico,
            newDemotesValue: valorNumerico * invoice.quantitySold,
            demotesCostValueUnit: invoiceCost,
            demotesCostValue: invoiceCost * invoice.quantitySold,
            newMarginUnit: invoiceMargin
          };
        })
      };
    });

    setDemotes(novosDados);
    onValueChange?.(valorNumerico);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const getMarginColor = (currentMargin, newMargin) => {
    if (newMargin > currentMargin) {
      return { backgroundColor: '#C8E6C9', color: '#388E3C' };
    }
    return { backgroundColor: '#FFCDD2', color: '#D32F2F' };
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={toggleOpen}
            sx={{
              color: '#666',
              '&:hover': { backgroundColor: '#F5F5F5' }
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        
        <TableCell sx={{ fontWeight: 500, color: '#333' }}>
          {invoicePayment.productName}
        </TableCell>
        
        <TableCell>
          <Chip
            label={invoicePayment.quantitySold}
            size="small"
            sx={{
              backgroundColor: '#E3F2FD',
              color: '#1976d2',
              fontWeight: 600
            }}
          />
        </TableCell>
        
        <TableCell sx={{ fontWeight: 600, color: '#333' }}>
          {formatCurrency(invoicePayment.salePriceUnit)}
        </TableCell>
        
        <TableCell sx={{ fontWeight: 600, color: '#333' }}>
          {formatCurrency(invoicePayment.salePrice)}
        </TableCell>
        
        <TableCell>
          {formatCurrency(invoicePayment.averageCostPriceProductUnit)}
        </TableCell>
        
        <TableCell sx={{ color: '#4caf50', fontWeight: 600 }}>
          {formatCurrency(invoicePayment.demotesCostValueUnit)}
        </TableCell>
        
        <TableCell>
          <TextField
            value={formatCurrencyInput(invoicePayment?.demotesValueUnit)}
            onChange={e => handleValorChange(invoicePayment.salePriceUnit, e.target.value)}
            variant="outlined"
            size="small"
            inputProps={{
              style: {
                textAlign: 'right',
                color: '#1976d2',
                fontWeight: 600
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
                backgroundColor: '#FFF',
                fontSize: '13px',
                '& fieldset': { borderColor: '#E0E0E0' },
                '&:hover fieldset': { borderColor: '#1976d2' },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  borderWidth: 2
                }
              }
            }}
          />
        </TableCell>
        
        <TableCell>
          <Chip
            label={`${Number(invoicePayment?.currentMarginUnit ?? 0).toFixed(2)}%`}
            size="small"
            sx={{
              backgroundColor: '#FFE0B2',
              color: '#F57C00',
              fontWeight: 600
            }}
          />
        </TableCell>
        
        <TableCell>
          <Chip
            label={`${Number(invoicePayment?.newMarginUnit ?? 0).toFixed(2)}%`}
            size="small"
            sx={{
              ...getMarginColor(
                invoicePayment.currentMarginUnit,
                invoicePayment.newMarginUnit
              ),
              fontWeight: 600
            }}
          />
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{
                  color: '#333',
                  fontWeight: 600,
                  fontSize: '16px',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TrendingDown sx={{ color: '#1976d2' }} />
                Detalhes das Notas Fiscais
              </Typography>
              
              <DemoteRowDetails
                items={invoicePayment.items || []}
                currentMarginUnit={invoicePayment.currentMarginUnit}
                newMarginUnit={invoicePayment.newMarginUnit}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
