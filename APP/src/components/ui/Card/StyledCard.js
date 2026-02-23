import { styled } from '@mui/material/styles';
import { Card, Paper } from '@mui/material';

/**
 * SummaryCard - Card de resumo estilizado
 */
export const SummaryCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFF',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5)
  }
}));

/**
 * KpiCard - Card de KPI estilizado
 */
export const KpiCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 8,
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
    transform: 'translateY(-1px)'
  }
}));

/**
 * ModernCard - Card moderno genérico
 */
export const ModernCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)'
  }
}));
