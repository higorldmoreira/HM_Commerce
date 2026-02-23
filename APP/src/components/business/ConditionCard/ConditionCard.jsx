import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { formatDateBR, formatDateTimeBR, formatPercentFixed, formatCurrency } from '../../../utils/formatters';
import { DetailsGrid } from '../../ui/DetailsGrid';

/**
 * ConditionCard - Card de condição de rebaixa
 * @param {Object} props - Props do componente
 * @param {Object} props.condicao - Dados da condição
 * @param {string} props.supplierName - Nome do fornecedor
 * @param {string} props.branchName - Nome da filial
 * @param {string} props.conditionName - Nome da condição
 * @param {Function} props.onEdit - Callback para editar
 * @param {Object} props.sx - Estilos customizados
 */
export const ConditionCard = ({
  condicao,
  supplierName,
  branchName,
  conditionName,
  onEdit,
  sx = {},
  ...props
}) => {
  const fields = [
    { key: 'supplier', label: 'Fornecedor', value: supplierName },
    { key: 'branch', label: 'Filial', value: branchName },
    { key: 'condition', label: 'Condição', value: conditionName },
    {
      key: 'allowNegativeBalance',
      label: 'Permite Saldo Negativo',
      value: (
        <Chip
          size="small"
          label={condicao.allowNegativeBalance ? 'Sim' : 'Não'}
          color={condicao.allowNegativeBalance ? 'success' : 'default'}
        />
      )
    },
    {
      key: 'returnThresholdPercent',
      label: 'Limite de Devolução (%)',
      value: formatPercentFixed(condicao.returnThresholdPercent)
    },
    { key: 'beginDate', label: 'Início', value: formatDateBR(condicao.beginDate) },
    { key: 'endDate', label: 'Fim', value: formatDateBR(condicao.endDate) },
    { key: 'registrationDate', label: 'Criado em', value: formatDateTimeBR(condicao.registrationDate) }
  ];

  const kpiFields = [
    { key: 'credit', label: 'Crédito', value: formatCurrency(condicao.creditedAmount) },
    { key: 'debit', label: 'Débito', value: formatCurrency(condicao.debitedAmount) },
    { key: 'balance', label: 'Saldo', value: formatCurrency(condicao.balanceAmount) }
  ];

  return (
    <Card
      sx={{
        p: 3,
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        },
        ...sx
      }}
      {...props}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {condicao.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              size="small"
              label={condicao.isActive ? 'Ativa' : 'Inativa'}
              color={condicao.isActive ? 'success' : 'default'}
            />
            <Chip
              size="small"
              label={`ID: ${condicao.id}`}
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Editar
          </Button>
        </Box>
      </Box>

      <DetailsGrid fields={fields} data={{}} />

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Resumo Financeiro
      </Typography>
      
      <DetailsGrid fields={kpiFields} data={{}} />
    </Card>
  );
};
