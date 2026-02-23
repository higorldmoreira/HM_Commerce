import { useState, useEffect, useCallback } from 'react';
import { getApiInstance } from '../services/api';

/**
 * Custom Hook para gerenciar integração com Metabase
 * Encapsula toda a lógica de estado e comunicação com API backend
 * 
 * @returns {Object} Estado e funções para integração Metabase
 */
export const useMetabase = () => {
  // Estados
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState(null);
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);

  // Instância da API
  const api = getApiInstance();

  /**
   * Busca lista de dashboards disponíveis do backend
   */
  const fetchDashboards = useCallback(async () => {
    try {
      setIsLoadingDashboards(true);
      setError(null);
      
      const response = await api.get('/metabase/dashboards');
      const data = response.data;

      if (!data || data.length === 0) {
        throw new Error('Nenhum dashboard foi encontrado ou habilitado para visualização.');
      }

      setDashboards(data);
      
      // Auto-seleciona o primeiro dashboard da lista
      if (data.length > 0 && data[0].id) {
        setSelectedDashboardId(data[0].id);
      }
      
    } catch (err) {
      console.error('Erro ao buscar dashboards:', err);
      setError(err.message || 'Erro ao carregar lista de dashboards');
      setDashboards([]);
    } finally {
      setIsLoadingDashboards(false);
    }
  }, [api]);

  /**
   * Carrega URL do dashboard específico
   * @param {number} dashboardId - ID do dashboard a ser carregado
   */
  const loadDashboard = useCallback(async (dashboardId) => {
    if (!dashboardId || dashboardId <= 0) {
      setError('ID do dashboard deve ser um inteiro maior que zero');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDashboardUrl(''); // Limpa URL anterior
      
      const response = await api.post('/metabase/dashboard-url', {
        dashboardId: Number(dashboardId),
        paramsSelecionados: {}
      });

      const data = response.data;
      
      if (!data.url) {
        throw new Error('URL do dashboard não foi retornada pelo servidor');
      }

      setDashboardUrl(data.url);
      
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao carregar dashboard');
      setDashboardUrl('');
    } finally {
      setLoading(false);
    }
  }, [api]);

  /**
   * Manipula mudança de dashboard selecionado
   * @param {number} dashboardId - Novo ID do dashboard
   */
  const handleDashboardChange = useCallback((dashboardId) => {
    setSelectedDashboardId(dashboardId);
  }, []);

  /**
   * Recarrega o dashboard atual manualmente
   */
  const reloadCurrentDashboard = useCallback(() => {
    if (selectedDashboardId && selectedDashboardId > 0) {
      loadDashboard(selectedDashboardId);
    }
  }, [selectedDashboardId, loadDashboard]);

  /**
   * Limpa estados de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efeito para carregar dashboards na inicialização
  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  // Efeito para reagir a mudanças no dashboard selecionado
  useEffect(() => {
    if (selectedDashboardId && selectedDashboardId > 0) {
      loadDashboard(selectedDashboardId);
    }
  }, [selectedDashboardId, loadDashboard]);

  // Estados derivados
  const hasError = !!error;
  const isReady = !isLoadingDashboards && !loading && dashboardUrl && !hasError;
  const isEmpty = !isLoadingDashboards && dashboards.length === 0;

  return {
    // Estados
    dashboards,
    selectedDashboardId,
    dashboardUrl,
    loading,
    error,
    isLoadingDashboards,
    
    // Estados derivados
    hasError,
    isReady,
    isEmpty,
    
    // Ações
    handleDashboardChange,
    reloadCurrentDashboard,
    clearError,
    fetchDashboards
  };
};