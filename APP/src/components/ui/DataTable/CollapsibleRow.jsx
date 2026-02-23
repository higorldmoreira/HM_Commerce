import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

/**
 * CollapsibleRow - Linha de tabela expansível
 * @param {Object} props - Props do componente
 * @param {Object} props.row - Dados da linha
 * @param {Array} props.columns - Configuração das colunas
 * @param {React.Component} props.DetailsComponent - Componente para detalhes
 * @param {Object} props.detailsProps - Props para o componente de detalhes
 * @param {Object} props.sx - Estilos customizados
 */
export const CollapsibleRow = ({
  row,
  columns,
  DetailsComponent,
  detailsProps = {},
  sx = {},
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { backgroundColor: '#F8F9FA' },
          ...sx
        }}
        {...props}
      >
        <TableCell>
          <IconButton
            size="small"
            onClick={toggleOpen}
            sx={{
              color: '#666',
              '&:hover': { backgroundColor: '#F5F5F5' }
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        
        {columns.map((column) => (
          <TableCell
            key={column.key}
            sx={column.cellSx}
            align={column.align}
          >
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              {DetailsComponent ? (
                <DetailsComponent row={row} {...detailsProps} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Detalhes não disponíveis
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
