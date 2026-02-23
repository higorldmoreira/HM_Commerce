// Re-export from centralized styled components
export { ResponsiveTableContainer as TableContainer } from '../../components/ui/Table/StyledTable';

// Local styled components
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ParametersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: '#F8F9FA',
  borderRadius: theme.spacing(1),
  border: '1px solid #E0E0E0'
}));