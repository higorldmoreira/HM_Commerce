import React from 'react'
import { Box } from '@mui/material'

const FiltersPanel = React.forwardRef(({ children, sx = {}, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      p: { xs: 2, sm: 3 },
      backgroundColor: '#F8F9FA',
      borderRadius: '12px',
      border: '1px solid #E0E0E0',
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
))

FiltersPanel.displayName = 'FiltersPanel'

export default FiltersPanel
