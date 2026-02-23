import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { formatCurrency } from '../../../utils/formatters';

/**
 * SupplierInfo - Informações do fornecedor
 * @param {Object} props - Props do componente
 * @param {string} props.supplierName - Nome do fornecedor
 * @param {number} props.supplierBalance - Saldo do fornecedor
 * @param {string} props.conditionName - Nome da condição
 * @param {Object} props.sx - Estilos customizados
 */
export const SupplierInfo = ({
  supplierName,
  supplierBalance,
  conditionName,
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }} {...props}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        <strong>Fornecedor:</strong> {supplierName || '-'}
      </Typography>
      
      {supplierBalance !== undefined && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Saldo Fornecedor:</strong> {formatCurrency(supplierBalance)}
        </Typography>
      )}
      
      {conditionName && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Condição:</strong> {conditionName}
        </Typography>
      )}
    </Box>
  );
};
