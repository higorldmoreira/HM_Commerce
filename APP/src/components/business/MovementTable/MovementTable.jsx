import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { formatCurrency } from '../../../utils/formatters';

/**
 * MovementTable - Tabela de movimentações
 * @param {Object} props - Props do componente
 * @param {Array} props.movements - Lista de movimentações
 * @param {Function} props.onObservationClick - Callback para clicar na observação
 * @param {Object} props.sx - Estilos customizados
 */
export const MovementTable = ({
  movements = [],
  onObservationClick,
  sx = {},
  ...props
}) => {
  const formatValueCurrencyCredit = (value, type) => {
    const formattedValue = type === 1 ? value : value * -1;
    return formatCurrency(formattedValue);
  };

  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid #E0E0E0', borderRadius: 2, ...sx }} {...props}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Data Registro
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Data Crédito
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Tipo
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Valor
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Usuário
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Observação
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement, index) => (
            <TableRow key={index}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {format(parseISO(movement.registrationDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {format(parseISO(movement.depositDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {movement.movementTypeName}
              </TableCell>
              <TableCell
                sx={{
                  whiteSpace: 'nowrap',
                  color: movement.movementTypeId === 1 ? 'success.main' : 'error.main',
                  fontWeight: 600
                }}
              >
                {formatValueCurrencyCredit(
                  movement.movementValue,
                  movement.movementTypeId
                )}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {movement.typistName}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onObservationClick?.(movement.observation ?? '')}
                >
                  <Info />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
