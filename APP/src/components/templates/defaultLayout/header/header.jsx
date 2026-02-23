import React from 'react'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import { Toolbar, Box, IconButton, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../../../contexts/AuthContext'
import SelectFilial from '../../../molecules/SelectFilial/SelectFilial'

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  // Z-index padrão do MUI é suficiente
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
  transition: theme.transitions.create(['left', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  left: 0,
  width: '100%',
  ...(open && {
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['left', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

export const Header = ({ open, handleDrawerOpen }) => {
  const { logout } = useAuth()

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar disableGutters sx={{ gap: { xs: 1, sm: 4 } }}>
        <Box display="flex" flexGrow={1} alignItems="center">
          <Box
            sx={{
              display: { xs: 'flex', sm: open ? 'none' : 'flex' },
              width: { xs: '48px', sm: '64px' },
              height: '64px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{ margin: 'auto' }}>
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Container simples sem interferência de eventos */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              paddingLeft: { xs: 1, sm: 2 },
              maxWidth: { xs: 'calc(100% - 140px)', sm: 'none' }
            }}
          >
            <SelectFilial />
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          paddingRight: { xs: 1, sm: 2 } 
        }}>
          <Button 
            variant="text" 
            color="inherit" 
            onClick={logout}
            sx={{ 
              fontSize: { xs: '12px', sm: '14px' },
              minWidth: { xs: '60px', sm: '80px' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
