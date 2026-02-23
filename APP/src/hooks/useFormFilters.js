import { useState, useCallback, useMemo } from 'react';
import { getSelectedBranchId } from '../utils/storage';

/**
 * useFormFilters - Hook para gerenciar filtros de formulário
 * @param {Object} options - Opções do hook
 * @param {Object} options.initialFilters - Filtros iniciais
 * @param {Function} options.onFiltersChange - Callback para mudança de filtros
 * @returns {Object} Estado e funções dos filtros
 */
export const useFormFilters = ({
  initialFilters = {},
  onFiltersChange
} = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      onFiltersChange?.(updated);
      return updated;
    });
  }, [onFiltersChange]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const getFiltersWithBranch = useCallback(() => {
    const savedBranch = getSelectedBranchId();
    return {
      ...filters,
      branchId: savedBranch || filters.branchId || ''
    };
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });
  }, [filters]);

  const filterCount = useMemo(() => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    }).length;
  }, [filters]);

  return {
    // Estado
    filters,
    showFilters,
    hasActiveFilters,
    filterCount,
    
    // Funções
    updateFilter,
    updateFilters,
    clearFilters,
    toggleFilters,
    getFiltersWithBranch,
    setShowFilters
  };
};
