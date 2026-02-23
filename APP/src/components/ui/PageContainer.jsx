import React from 'react'
import { Box } from '@mui/material'

const PageContainer = React.forwardRef(({ children, sx = {}, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      minHeight: '100vh',
      backgroundColor: theme => theme.palette.grey[100] || '#F8F9FA',
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3, md: 4 },
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
))

PageContainer.displayName = 'PageContainer'

export default PageContainer
