import { styled } from '@mui/material/styles';
import { Table, TableCell, TableRow } from '@mui/material';

/**
 * ModernTable - Tabela estilizada moderna
 */
export const ModernTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    backgroundColor: '#F8F9FA'
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#333',
    fontSize: '14px',
    borderBottom: '2px solid #E0E0E0',
    padding: '16px 8px',
    whiteSpace: 'nowrap'
  },
  '& .MuiTableCell-body': {
    fontSize: '13px',
    color: '#666',
    borderBottom: '1px solid #F0F0F0',
    padding: '12px 8px',
    whiteSpace: 'nowrap'
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: '#F8F9FA'
  }
}));

/**
 * ResponsiveTableContainer - Container responsivo para tabelas
 */
export const ResponsiveTableContainer = styled('div')(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  marginTop: theme.spacing(2),
  border: '1px solid #E0E0E0',
  borderRadius: 12,
  '& .MuiTable-root': {
    minWidth: 1200
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTable-root': {
      minWidth: 800
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTable-root': {
      minWidth: 600
    }
  }
}));

/**
 * StyledTableCell - Célula de tabela estilizada
 */
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: '#333',
  borderBottom: '1px solid #F0F0F0',
  padding: '12px 8px',
  whiteSpace: 'nowrap'
}));

/**
 * StyledTableRow - Linha de tabela estilizada
 */
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#F8F9FA'
  },
  '& > *': {
    borderBottom: 'unset'
  }
}));
