import React, { useState } from 'react'
import TabsManager from '../../ui/TabsManager'
import { Box, CssBaseline, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import { Header } from './header/header'
import { SideBar } from './sidebar/sidebar'
import { Home } from '../../../pages/home/home';
import { GestaoDeCredito } from '../../../pages/gestaoDeCredito/gestaoDeCredito';
import { GestaoDeRebaixa } from '../../../pages/gestaoDeRebaixa/gestaoDeRebaixa';

import { CondicaoDeRebaixa } from '../../../pages/condicaoDeRebaixa/condicaoDeRebaixa';

export const DefaultLayout = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false) // Inicia fechado (modo hambúrguer)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideBar open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} />
      
      {/* Overlay para mobile quando sidebar está aberta */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1, 
            display: { xs: 'block', sm: 'none' }
          }}
          onClick={handleDrawerClose}
        />
      )}
      
      <Box sx={{ 
        flexGrow: 1, 
        paddingTop: '64px',
        marginLeft: { 
          xs: '0px',    // Mobile: sempre sem margem 
          sm: '0px'  // Desktop: sem margem
        },
        transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
        position: 'relative'
      }}>
        {/* TabsManager substitui Outlet para navegação por abas */}
        <TabsManager initialTabs={[{
          id: 'home',
          title: 'Home',
          component: Home
        }]} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            position: 'fixed',
            bottom: 0,
            left: '0px',
            right: 0,
            height: '36px',
            px: 2,
            borderTop: 'solid 1px var(--divider)',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: '#FFF',
            transition: 'left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
            zIndex: 1
          }}>
          <img src="/Logo_HM.svg" alt="Logo" style={{ width: '35px', height: '25px' }} />
          <Typography variant="caption" style={{ marginLeft: '20px' }}>
            {new Date().getFullYear()} Commerce — Todos os direitos reservados
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
