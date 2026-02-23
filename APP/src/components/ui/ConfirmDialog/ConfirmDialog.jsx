import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

/**
 * ConfirmDialog - Modal de confirmação
 * @param {Object} props - Props do componente
 * @param {boolean} props.open - Se o modal está aberto
 * @param {Function} props.onClose - Callback para fechar
 * @param {Function} props.onConfirm - Callback para confirmar
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem do modal
 * @param {string} props.confirmText - Texto do botão de confirmar
 * @param {string} props.cancelText - Texto do botão de cancelar
 * @param {string} props.severity - Severidade (error, warning, info, success)
 * @param {boolean} props.loading - Se está carregando
 * @param {Object} props.sx - Estilos customizados
 */
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'info',
  loading = false,
  sx = {},
  ...props
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      case 'success':
        return '#2e7d32';
      default:
        return '#1976d2';
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        },
        ...sx
      }}
      {...props}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E0E0E0',
          pb: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: getSeverityColor() }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid #E0E0E0',
          gap: 2
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#E0E0E0',
            color: '#666',
            '&:hover': {
              borderColor: '#BDBDBD',
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: getSeverityColor(),
            '&:hover': {
              backgroundColor: getSeverityColor(),
              filter: 'brightness(0.9)'
            },
            '&:disabled': {
              backgroundColor: '#BDBDBD'
            }
          }}
        >
          {loading ? 'Processando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
