import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

/**
 * EmptyState - Estado vazio genérico
 * @param {Object} props - Props do componente
 * @param {boolean} props.hasFilters - Se há filtros aplicados
 * @param {Function} props.onAdd - Callback para ação de adicionar
 * @param {string} props.title - Título do estado vazio
 * @param {string} props.description - Descrição do estado vazio
 * @param {string} props.addButtonText - Texto do botão de adicionar
 * @param {React.Component} props.icon - Ícone customizado
 * @param {Object} props.sx - Estilos customizados
 */
export const EmptyState = ({
  hasFilters = false,
  onAdd,
  title,
  description,
  addButtonText = 'Adicionar',
  icon,
  sx = {},
  ...props
}) => {
  const defaultTitle = hasFilters
    ? 'Nenhum resultado encontrado'
    : 'Selecione os filtros e clique em Filtrar.';

  const defaultDescription = hasFilters
    ? 'Tente ajustar os filtros ou crie um novo item.'
    : 'Depois de aplicar os filtros, os detalhes aparecerão aqui.';

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        ...sx
      }}
      {...props}
    >
      <Box sx={{ fontSize: 64, opacity: 0.15, mb: 2 }}>
        {icon || '⌾'}
      </Box>

      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontWeight: 500 }}
        component="div"
      >
        {title || defaultTitle}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
        component="div"
      >
        {description || defaultDescription}
      </Typography>

      {onAdd && (
        <Button
          variant="contained"
          onClick={onAdd}
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {addButtonText}
        </Button>
      )}
    </Stack>
  );
};
