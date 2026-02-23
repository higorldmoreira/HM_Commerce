import React from 'react';
import { 
  Typography, 
  Box, 
  Grid,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  AccountBalance,
  MonetizationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../enums/routePaths';
import { PageContainer, SurfaceCard, ActionButton } from '../../components/ui';
import { GestaoDeCredito } from '../gestaoDeCredito/gestaoDeCredito';
import { GestaoDeRebaixa } from '../gestaoDeRebaixa/gestaoDeRebaixa';
import { CondicaoDeRebaixa } from '../condicaoDeRebaixa/condicaoDeRebaixa';
import { Relatorios } from '../relatorios/relatorios';

/**
 * Componente Home - Página inicial do sistema
 * Dashboard principal com cards de navegação para as funcionalidades
 */
export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Gestão de Crédito',
      description: 'Gerenciar limites de crédito e análise de riscos dos clientes',
      icon: <AccountBalance />,
      path: ROUTE_PATHS.gestaoDeCredito,
      color: '#1976d2'
    },
    {
      title: 'Gestão de Rebaixa',
      description: 'Controlar processos de rebaixa de produtos e ajustes de preços',
      icon: <TrendingUp />,
      path: ROUTE_PATHS.gestaoDeRebaixa,
      color: '#4caf50'
    },
    {
      title: 'Condição de Rebaixa',
      description: 'Configurar condições e regras para processos de rebaixa',
      icon: <MonetizationOn />,
      path: ROUTE_PATHS.condicaoDeRebaixa,
      color: '#ff9800'
    },
    {
      title: 'Relatórios',
      description: 'Gere e visualize relatórios gerenciais e analíticos',
      icon: <Assessment />,
      path: ROUTE_PATHS.relatorios,
      color: '#9c27b0'
    }
  ];

  // Substituir navegação por rotas por abertura de abas
  const handleOpenTab = (module) => {
    let component;
    switch (module.path) {
      case ROUTE_PATHS.gestaoDeCredito:
        component = GestaoDeCredito;
        break;
      case ROUTE_PATHS.gestaoDeRebaixa:
        component = GestaoDeRebaixa;
        break;
      case ROUTE_PATHS.condicaoDeRebaixa:
        component = CondicaoDeRebaixa;
        break;
      case ROUTE_PATHS.relatorios:
        component = Relatorios;
        break;
      default:
        component = null;
    }
    if (component) {
      window.openTab({
        id: module.path,
        title: module.title,
        component
      });
    }
  };

  return (
    <PageContainer
      sx={{
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        backgroundSize: 'cover'
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <SurfaceCard
          sx={{
            textAlign: 'center',
            mb: 6,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}
          >
            Commerce
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ color: theme.palette.text.secondary }}
          >
            Sistema de Gestão Comercial
          </Typography>
        </SurfaceCard>

        <Grid container spacing={3}>
          {modules.map((module, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <SurfaceCard
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid transparent',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: module.color,
                    background: 'rgba(255, 255, 255, 1)',
                    '& .module-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }
                }}
              >
                <Box sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      className="module-icon"
                      sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${module.color}1A 0%, ${module.color}0D 100%)`,
                        marginRight: 2,
                        color: module.color,
                        '& svg': {
                          fontSize: 40
                        }
                      }}
                    >
                      {module.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                    >
                      {module.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                  >
                    {module.description}
                  </Typography>
                </Box>
                <Box sx={{ p: 3, pt: 0 }}>
                  <ActionButton
                    tone="primary"
                    fullWidth
                    onClick={() => handleOpenTab(module)}
                    sx={{
                      backgroundColor: module.color,
                      '&:hover': {
                        backgroundColor: module.color,
                        filter: 'brightness(0.9)'
                      },
                      fontWeight: 600,
                      py: 1.5
                    }}
                  >
                    Acessar Módulo
                  </ActionButton>
                </Box>
              </SurfaceCard>
            </Grid>
          ))}
        </Grid>

        <SurfaceCard
          sx={{
            mt: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Sistema de Gestão Comercial
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Plataforma integrada para gestão de crédito, rebaixas e análise de dados comerciais.
            Desenvolvido para otimizar processos e fornecer insights estratégicos para tomada de decisões.
          </Typography>
        </SurfaceCard>
      </Box>
    </PageContainer>
  );
};
