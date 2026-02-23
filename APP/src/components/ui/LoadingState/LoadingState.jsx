import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

/**
 * LoadingState - Estado de carregamento
 * @param {Object} props - Props do componente
 * @param {string} props.message - Mensagem de carregamento
 * @param {boolean} props.fullHeight - Se deve ocupar altura total
 * @param {Object} props.sx - Estilos customizados
 */
export const LoadingState = ({
  message = 'Carregando...',
  fullHeight = false,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: fullHeight ? 6 : 3,
        minHeight: fullHeight ? '200px' : 'auto',
        ...sx
      }}
      {...props}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
};
