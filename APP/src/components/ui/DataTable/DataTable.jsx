import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { TableHeader } from './TableHeader';

/**
 * DataTable - Componente de tabela reutilizável
 * @param {Object} props - Props do componente
 * @param {Array} props.data - Dados da tabela
 * @param {Array} props.columns - Configuração das colunas
 * @param {Object} props.pagination - Configuração da paginação
 * @param {Function} props.onPageChange - Callback para mudança de página
 * @param {Function} props.onRowsPerPageChange - Callback para mudança de linhas por página
 * @param {Function} props.onSort - Callback para ordenação
 * @param {Object} props.sortConfig - Configuração de ordenação atual
 * @param {React.Component} props.RowComponent - Componente customizado para linha
 * @param {Object} props.sx - Estilos customizados
 * @param {boolean} props.loading - Estado de carregamento
 * @param {React.Component} props.loadingComponent - Componente de loading customizado
 * @param {React.Component} props.emptyComponent - Componente de estado vazio
 */
export const DataTable = ({
  data = [],
  columns = [],
  pagination = {},
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortConfig = {},
  RowComponent,
  sx = {},
  loading = false,
  loadingComponent,
  emptyComponent,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    page = 0,
    rowsPerPage = isMobile ? 5 : 10,
    totalRows = 0,
    rowsPerPageOptions = [5, 10, 20, 50, 100]
  } = pagination;

  const handlePageChange = (event, newPage) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const handleSort = (columnKey) => {
    onSort?.(columnKey);
  };

  if (loading) {
    return loadingComponent || (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        Carregando...
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return emptyComponent || (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        Nenhum dado encontrado
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <React.Fragment key={row.id || index}>
                {RowComponent ? (
                  <RowComponent row={row} index={index} />
                ) : (
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        sx={column.cellSx}
                        align={column.align}
                      >
                        {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
      
      {pagination && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      )}
    </Paper>
  );
};
