import React from 'react';
import { Grid, Box } from '@mui/material';
import { StatCard } from '../../ui/StatCard';
import { formatCurrency, formatPercentFixed } from '../../../utils/formatters';

/**
 * DemoteSummary - Resumo de rebaixas
 * @param {Object} props - Props do componente
 * @param {Object} props.totals - Totais calculados
 * @param {number} props.calculatedMargin - Margem calculada
 * @param {Object} props.sx - Estilos customizados
 */
export const DemoteSummary = ({
  totals = {},
  calculatedMargin = 0,
  sx = {},
  ...props
}) => {
  const {
    quantity = 0,
    salePrice = 0,
    costPrice = 0,
    demoteCostValue = 0,
    newDemoteValue = 0
  } = totals;

  return (
    <Grid container spacing={2} sx={sx} {...props}>
      <Grid item xs={12} md={2}>
        <StatCard
          title="Qtd. Total"
          value={quantity}
          unit="Un"
        />
      </Grid>
      
      <Grid item xs={12} md={2}>
        <StatCard
          title="Tot. Venda"
          value={formatCurrency(salePrice)}
        />
      </Grid>
      
      <Grid item xs={12} md={2}>
        <StatCard
          title="Custo Total"
          value={formatCurrency(costPrice)}
        />
      </Grid>
      
      <Grid item xs={12} md={2}>
        <StatCard
          title="C. Rebaixa"
          value={formatCurrency(demoteCostValue)}
        />
      </Grid>
      
      <Grid item xs={12} md={2}>
        <StatCard
          title="Tot. Rebaixa"
          value={formatCurrency(newDemoteValue)}
        />
      </Grid>
      
      <Grid item xs={12} md={2}>
        <StatCard
          title="M. Calculada"
          value={formatPercentFixed(calculatedMargin)}
        />
      </Grid>
    </Grid>
  );
};
