import React from 'react'
import { Paper } from '@mui/material'

const SurfaceCard = React.forwardRef(
  ({ children, sx = {}, elevation = 1, padding = 3, ...props }, ref) => (
    <Paper
      ref={ref}
      elevation={elevation}
      sx={{
        borderRadius: '16px',
        border: '1px solid #E0E0E0',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        p: { xs: 2, sm: padding },
        ...sx
      }}
      {...props}
    >
      {children}
    </Paper>
  )
)

SurfaceCard.displayName = 'SurfaceCard'

export default SurfaceCard
