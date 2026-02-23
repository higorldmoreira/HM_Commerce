import { useState, useCallback, useMemo } from 'react';

/**
 * useTableState - Hook para gerenciar estado de tabela
 * @param {Object} options - Opções do hook
 * @param {Array} options.data - Dados da tabela
 * @param {string} options.defaultOrderBy - Campo padrão para ordenação
 * @param {string} options.defaultOrder - Ordem padrão (asc/desc)
 * @param {number} options.defaultRowsPerPage - Linhas por página padrão
 * @returns {Object} Estado e funções da tabela
 */
export const useTableState = ({
  data = [],
  defaultOrderBy = 'id',
  defaultOrder = 'asc',
  defaultRowsPerPage = 10
} = {}) => {
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleRequestSort = useCallback((property) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleChangePage = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const sortedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return [...data].sort((a, b) => {
      const aValue = a?.[orderBy] ?? 0;
      const bValue = b?.[orderBy] ?? 0;
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage]);

  const totalRows = data.length;

  return {
    // Estado
    order,
    orderBy,
    page,
    rowsPerPage,
    totalRows,
    
    // Dados processados
    sortedData,
    paginatedData,
    
    // Funções
    handleRequestSort,
    handleChangePage,
    handleChangeRowsPerPage,
    
    // Configuração de ordenação
    sortConfig: { order, orderBy },
    
    // Configuração de paginação
    pagination: {
      page,
      rowsPerPage,
      totalRows
    }
  };
};
