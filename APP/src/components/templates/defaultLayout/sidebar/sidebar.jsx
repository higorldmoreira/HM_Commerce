import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  AccountBalance,
  PriceChange,
  Receipt,
  BarChart,
  Menu
} from '@mui/icons-material'
import logo from '../../../../assets/Logo_HM.svg'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../../../enums/routePaths'
import { GestaoDeCredito } from '../../../../pages/gestaoDeCredito/gestaoDeCredito'
import { GestaoDeRebaixa } from '../../../../pages/gestaoDeRebaixa/gestaoDeRebaixa'
import { CondicaoDeRebaixa } from '../../../../pages/condicaoDeRebaixa/condicaoDeRebaixa'
import { Relatorios } from '../../../../pages/relatorios/relatorios'

const drawerWidth = 280
const collapsedWidth = 64

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  background: '#FFF',
  borderRight: '1px solid #E0E0E0'
})

const closedMixin = theme => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  background: '#FFF',
  borderRight: '1px solid #E0E0E0',
  width: collapsedWidth,
  [theme.breakpoints.down('sm')]: {
    width: 0,
    borderRight: 'none'
  }
})

const DrawerHeader = styled('div')(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'center',
  padding: theme.spacing(2, 1),
  minHeight: 64,
  borderBottom: '1px solid #E0E0E0'
}))

const HamburgerButton = styled(IconButton)(({ theme }) => ({
  color: '#666',
  '&:hover': {
    backgroundColor: '#F5F5F5',
    color: '#333'
  }
}))

const LogoContainer = styled(Box)(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#F5F5F5'
  }
}))

const ModernListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  minHeight: 48,
  margin: '4px 12px',
  borderRadius: 8,
  padding: '12px 16px',
  backgroundColor: active ? '#E3F2FD' : 'transparent',
  color: active ? '#1976d2' : '#666',
  '&:hover': {
    backgroundColor: active ? '#E3F2FD' : '#F5F5F5',
    color: active ? '#1976d2' : '#333'
  },
  '& .MuiListItemIcon-root': {
    color: active ? '#1976d2' : '#666'
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    fontSize: '14px'
  }
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        [theme.breakpoints.down('sm')]: {
          position: 'fixed',
          zIndex: 1300
        }
      }
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        [theme.breakpoints.down('sm')]: {
          width: 0,
          borderRight: 'none',
          overflow: 'hidden'
        }
      }
    })
  })
)

export const SideBar = ({ open, handleDrawerClose, handleDrawerOpen }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const currentPath = window.location.pathname

  const menuItems = [
    {
      text: 'Relatórios',
      icon: <BarChart />,
      path: ROUTE_PATHS.relatorios,
      key: 'relatorios'
    },
    {
      text: 'Gestão de Crédito',
      icon: <AccountBalance />,
      path: ROUTE_PATHS.gestaoDeCredito,
      key: 'credito'
    },
    {
      text: 'Condição de Rebaixa',
      icon: <PriceChange />,
      path: ROUTE_PATHS.condicaoDeRebaixa,
      key: 'condicao'
    },
    {
      text: 'Gestão de Rebaixa',
      icon: <Receipt />,
      path: ROUTE_PATHS.gestaoDeRebaixa,
      key: 'rebaixa'
    }
  ]

  // Substituir navegação por rotas por abertura de abas
  const handleOpenTab = (item) => {
    let component
    switch (item.path) {
      case ROUTE_PATHS.gestaoDeCredito:
        component = GestaoDeCredito
        break
      case ROUTE_PATHS.gestaoDeRebaixa:
        component = GestaoDeRebaixa
        break
      case ROUTE_PATHS.condicaoDeRebaixa:
        component = CondicaoDeRebaixa
        break
      case ROUTE_PATHS.relatorios:
        component = Relatorios
        break
      default:
        component = null
    }
    if (component) {
      window.openTab({
        id: item.path,
        title: item.text,
        component
      })
    }
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {!open ? (
          <HamburgerButton onClick={handleDrawerOpen}>
            <Menu />
          </HamburgerButton>
        ) : (
          <>
              <LogoContainer open={open}>
              <img
                src={logo}
                style={{ 
                  width: 120, 
                  height: 52,
                  transition: 'all 0.3s ease'
                }}
                alt="Commerce Logo"
              />
            </LogoContainer>
            
            <HamburgerButton onClick={handleDrawerClose}>
              <ChevronLeft />
            </HamburgerButton>
          </>
        )}
      </DrawerHeader>
      
      <Box sx={{ pt: 2 }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = currentPath === item.path
            
            return (
              <ListItem key={item.key} disablePadding>
                {open ? (
                  <ModernListItemButton
                    active={isActive ? 'true' : 'false'}
                    onClick={() => handleOpenTab(item)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ModernListItemButton>
                ) : (
                  <Tooltip title={item.text} placement="right" arrow>
                    <ModernListItemButton
                      active={isActive ? 'true' : 'false'}
                      onClick={() => handleOpenTab(item)}
                      sx={{ justifyContent: 'center', mx: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        {item.icon}
                      </ListItemIcon>
                    </ModernListItemButton>
                  </Tooltip>
                )}
              </ListItem>
            )
          })}
        </List>
      </Box>
      
</Drawer>
  )
}
