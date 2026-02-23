
import React from 'react';
import { 
  Typography, 
  Box, 
  Alert, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Skeleton,
  CircularProgress
} from '@mui/material';
import { useMetabase } from '../../hooks/useMetabase';
import { PageContainer, SurfaceCard } from '../../components/ui';

/**
 * Componente BI - Dashboard Metabase
 * Componente puramente visual que utiliza o hook useMetabase
 * para gerenciar estado e comunicação com API
 */
export const BI = () => {
  const {
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
    clearError
  } = useMetabase();

  return (
    <PageContainer sx={{ backgroundColor: 'transparent' }}>
      <SurfaceCard sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          BI - Dashboard
        </Typography>

      {/* Loading skeleton para lista de dashboards */}
      {isLoadingDashboards && (
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      )}

      {/* Erro ao carregar dashboards */}
      {hasError && !isLoadingDashboards && (
        <Alert 
          severity={isEmpty ? "warning" : "error"}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={reloadCurrentDashboard}>
              Tentar novamente
            </Button>
          }
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Controles - Select Dashboard */}
      {!isLoadingDashboards && !isEmpty && dashboards.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <FormControl fullWidth>
            <InputLabel>Dashboard Selecionado</InputLabel>
            <Select
              value={selectedDashboardId || ''}
              label="Dashboard Selecionado"
              onChange={(e) => handleDashboardChange(e.target.value)}
              disabled={loading}
            >
              {dashboards.map((dashboard) => (
                <MenuItem key={dashboard.id} value={dashboard.id}>
                  {dashboard.name} {dashboard.description && `- ${dashboard.description}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={reloadCurrentDashboard}
            disabled={!selectedDashboardId || loading}
            sx={{ minWidth: 120, height: 56 }}
          >
            {loading ? 'Carregando...' : 'Carregar'}
          </Button>
        </Box>
      )}

      </SurfaceCard>

      {/* Loading para geração de URL */}
      {loading && !isLoadingDashboards && (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Carregando dashboard...
          </Typography>
        </Box>
      )}

      {/* Dashboard pronto para exibição */}
      {isReady && (
        <SurfaceCard sx={{ p: 0, flex: 1 }}>
          <Box sx={{ 
            flex: 1,
            width: '100%', 
            height: '70vh',
            borderRadius: '8px', 
            overflow: 'hidden'
          }}>
            <iframe
              src={dashboardUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`Dashboard ${dashboards.find(d => d.id === selectedDashboardId)?.name || 'Metabase'}`}
              style={{ 
                border: 'none',
                display: 'block'
              }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </Box>
        </SurfaceCard>
      )}

      {/* Estado vazio - nenhum dashboard disponível */}
      {isEmpty && !isLoadingDashboards && (
        <SurfaceCard sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum Dashboard Disponível
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verifique a configuração do Metabase ou entre em contato com o administrador
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Recarregar Página
          </Button>
        </SurfaceCard>
      )}
    </PageContainer>
  );
};
