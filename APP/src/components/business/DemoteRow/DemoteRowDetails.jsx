import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { formatCurrency, formatPercentFixed } from '../../../utils/formatters';

/**
 * DemoteRowDetails - Detalhes das notas fiscais em uma linha expansível
 * @param {Object} props - Props do componente
 * @param {Array} props.items - Lista de itens (notas fiscais)
 * @param {number} props.currentMarginUnit - Margem atual
 * @param {number} props.newMarginUnit - Nova margem
 */
export const DemoteRowDetails = ({
  items = [],
  currentMarginUnit = 0,
  newMarginUnit = 0
}) => {
  const getMarginColor = (current, newValue) => {
    if (newValue > current) {
      return { backgroundColor: '#C8E6C9', color: '#388E3C' };
    }
    return { backgroundColor: '#FFCDD2', color: '#D32F2F' };
  };

  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Nenhuma nota fiscal encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid #E0E0E0', borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'primary.contrastText' }}>NF</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Data</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Qtd</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Preço Unit.</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Total Venda</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Custo Médio</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Custo Rebaixa</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Valor Rebaixa</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Margem Atual</TableCell>
            <TableCell sx={{ color: 'primary.contrastText' }}>Nova Margem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>
                {format(parseISO(invoice.invoiceIssueDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>{invoice.quantitySold}</TableCell>
              <TableCell>{formatCurrency(invoice.salePriceUnit)}</TableCell>
              <TableCell>{formatCurrency(invoice.salePrice)}</TableCell>
              <TableCell>
                {formatCurrency(invoice.averageCostPriceProductUnit)}
              </TableCell>
              <TableCell sx={{ color: '#4caf50' }}>
                {formatCurrency(invoice.demotesCostValueUnit)}
              </TableCell>
              <TableCell sx={{ color: '#1976d2', fontWeight: 600 }}>
                {formatCurrency(invoice.demotesValueUnit)}
              </TableCell>
              <TableCell>
                <Chip
                  label={`${Number(currentMarginUnit ?? 0).toFixed(2)}%`}
                  size="small"
                  sx={{ backgroundColor: '#FFE0B2', color: '#F57C00' }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={`${Number(newMarginUnit ?? 0).toFixed(2)}%`}
                  size="small"
                  sx={getMarginColor(currentMarginUnit, newMarginUnit)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
