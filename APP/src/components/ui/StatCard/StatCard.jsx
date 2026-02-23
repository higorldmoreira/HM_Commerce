import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

/**
 * StatCard - Card de estatísticas/KPI
 * @param {Object} props - Props do componente
 * @param {string} props.title - Título do card
 * @param {string|number} props.value - Valor a ser exibido
 * @param {string} props.unit - Unidade do valor (opcional)
 * @param {string} props.color - Cor do valor (opcional)
 * @param {boolean} props.negative - Se o valor é negativo (para formatação)
 * @param {Object} props.sx - Estilos customizados
 * @param {React.Component} props.icon - Ícone do card (opcional)
 */
export const StatCard = ({
  title,
  value,
  unit = '',
  color = 'text.primary',
  negative = false,
  sx = {},
  icon,
  ...props
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #E0E0E0',
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && (
          <Box sx={{ mr: 1, color: 'primary.main' }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
      </Box>
      
      <Typography
        variant="h5"
        component="div"
        sx={{
          mt: 1,
          color: negative ? 'error.main' : color,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.5
        }}
      >
        {value}
        {unit && (
          <Typography
            variant="body2"
            component="span"
            sx={{ color: 'text.secondary', fontWeight: 400 }}
          >
            {unit}
          </Typography>
        )}
      </Typography>
    </Paper>
  );
};
