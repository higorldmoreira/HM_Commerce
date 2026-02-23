import styled from 'styled-components'
import { Button, Card, Paper, TextField, Box } from '@mui/material'

export const ModernContainer = styled(Box)`
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
`

export const ModernCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

export const ModernLogo = styled.img`
  width: 260px;
  height: auto;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    width: 140px;
  }
`

export const ModernTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    
    & fieldset {
      border-color: var(--divider);
    }
    
    &:hover fieldset {
      border-color: color-mix(in srgb, var(--primary-main) 50%, transparent);
    }
    
    &.Mui-focused fieldset {
      border-color: var(--primary-main);
      border-width: 2px;
    }
  }
  
  & .MuiInputLabel-root {
    color: var(--text-secondary);
    font-weight: 500;
    
    &.Mui-focused {
      color: var(--primary-main);
    }
  }
`

export const ModernButton = styled(Button)`
  border-radius: 12px !important;
  padding: 16px 24px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  text-transform: none !important;
  background: linear-gradient(45deg, var(--primary-main), color-mix(in srgb, var(--primary-main) 70%, white)) !important;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--primary-main) 40%, transparent) !important;
  
  &:hover {
    background: linear-gradient(45deg, color-mix(in srgb, var(--primary-main) 85%, black), var(--primary-main)) !important;
  }
`

export const ModernFooter = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--divider-opaque);
  display: flex;
  justify-content: center;
`
