import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

/**
 * ValueInput - Input de valor estilizado
 */
export const ValueInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 6,
    backgroundColor: '#FFF',
    fontSize: '13px',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#1976d2'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px'
  }
}));

/**
 * CurrencyInputStyled - Input de moeda estilizado
 */
export const CurrencyInputStyled = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#FFF',
    fontSize: '14px',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#BDBDBD'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2
    }
  }
}));

/**
 * ModernTextField - TextField moderno genérico
 */
export const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#FFF',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#BDBDBD'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2
    }
  }
}));
