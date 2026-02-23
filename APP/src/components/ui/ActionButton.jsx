import React from 'react'
import { Button } from '@mui/material'

const toneStyles = {
  primary: {
    backgroundColor: '#1976d2',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#1565c0'
    },
    '&:disabled': {
      backgroundColor: '#BDBDBD'
    }
  },
  secondary: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
    border: '1px solid #E0E0E0',
    '&:hover': {
      backgroundColor: '#EEEEEE'
    }
  },
  success: {
    backgroundColor: '#4caf50',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#45a049'
    }
  }
}

const ActionButton = React.forwardRef(({ tone = 'primary', sx = {}, ...props }, ref) => (
  <Button
    ref={ref}
    sx={{
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '14px',
      px: 2.5,
      py: 1.25,
      ...toneStyles[tone],
      ...sx
    }}
    {...props}
  />
))

ActionButton.displayName = 'ActionButton'

export default ActionButton
