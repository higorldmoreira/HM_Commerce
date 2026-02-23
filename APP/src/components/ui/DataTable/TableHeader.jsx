import React from 'react';
import { TableCell, TableSortLabel, Typography } from '@mui/material';

/**
 * TableHeader - Cabeçalho de tabela com ordenação
 * @param {Object} props - Props do componente
 * @param {Object} props.column - Configuração da coluna
 * @param {Object} props.sortConfig - Configuração de ordenação atual
 * @param {Function} props.onSort - Callback para ordenação
 */
export const TableHeader = ({ column, sortConfig, onSort }) => {
  const { key, label, sortable = true, align = 'left', sx = {} } = column;
  
  const isActive = sortConfig.orderBy === key;
  const direction = isActive ? sortConfig.order : 'asc';

  const handleSort = () => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  return (
    <TableCell
      sortDirection={isActive ? direction : false}
      sx={{
        whiteSpace: 'nowrap',
        fontWeight: 600,
        backgroundColor: '#F8F9FA',
        borderBottom: '2px solid #E0E0E0',
        ...sx
      }}
      align={align}
    >
      {sortable ? (
        <TableSortLabel
          active={isActive}
          direction={direction}
          onClick={handleSort}
          sx={{
            '& .MuiTableSortLabel-icon': {
              color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </TableSortLabel>
      ) : (
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      )}
    </TableCell>
  );
};
