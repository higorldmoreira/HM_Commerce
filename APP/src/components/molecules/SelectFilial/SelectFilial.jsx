import { useEffect, useState } from 'react'
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Box, 
  Typography,
  styled
} from '@mui/material'
import { 
  Business, 
  LocationOn 
} from '@mui/icons-material'
import { useCombo } from '../../../features/combo'

// FormControl simplificado - mantém apenas estilos visuais necessários
const ResponsiveFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  maxWidth: 480,
  '& .MuiInputLabel-root': {
    color: '#666',
    fontSize: '14px',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#1976d2'
    },
    '&.MuiInputLabel-shrink': {
      backgroundColor: '#FFF',
      padding: '0 4px'
    }
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#FFF',
    '& fieldset': {
      borderColor: '#E0E0E0'
    },
    '&:hover fieldset': {
      borderColor: '#BDBDBD'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2
    }
  },
  '& .MuiSelect-select': {
    color: '#333',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingRight: '32px !important',
    paddingTop: '12px',
    paddingBottom: '12px'
  },
  '& .MuiSelect-icon': {
    color: '#666'
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 160,
    maxWidth: 300
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 140,
    maxWidth: 250,
    '& .MuiSelect-select': {
      fontSize: '13px'
    },
    '& .MuiInputLabel-root': {
      fontSize: '13px'
    }
  }
}))

// MenuItem simplificado - sem interferência de eventos
const ModernMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '14px',
  padding: '12px 16px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  '&:hover': {
    backgroundColor: '#F5F5F5'
  },
  '&.Mui-selected': {
    backgroundColor: '#E3F2FD',
    color: '#1976d2',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#E3F2FD'
    }
  }
}))

export default function SelectFilial() {
  const [branchId, setBranchId] = useState('')
  const { fetchBranches, branches } = useCombo()

  useEffect(() => {
    const saved = localStorage.getItem('selectedBranchId')
    if (saved && saved !== 'null' && saved !== '(TODAS)') {
      setBranchId(saved)
    } else {
      setBranchId('')
    }
  }, [branches])

  // Handler simples - sem interferência de propagação
  const handleChange = event => {
    const selectedId = event.target.value

    if (selectedId === '(TODAS)') {
      setBranchId('')
      localStorage.setItem('selectedBranchId', 'null')
      window.dispatchEvent(new Event('selectedBranchChanged'))
      return
    }

    const normalizedValue = String(selectedId)
    setBranchId(normalizedValue)
    localStorage.setItem('selectedBranchId', normalizedValue)
    window.dispatchEvent(new Event('selectedBranchChanged'))
  }

  useEffect(() => {
    if (!branches) {
      fetchBranches()
    }
  }, [])

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: '100%',
      maxWidth: 480
    }}>
      {branches && (
        <ResponsiveFormControl size="small" fullWidth variant="outlined">
          <Select
            labelId="branchId-label"
            label="Selecionar Filial"
            value={branchId}
            displayEmpty
            onChange={handleChange}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #E0E0E0'
                }
              }
            }}
            renderValue={selected => {
              if (!selected || selected === 'null' || selected === '(TODAS)') {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#1976d2' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#999' }}>
                      Selecionar Filial
                    </Typography>
                  </Box>
                )
              }

              const branch = branches?.find(b => String(b.branchId) === String(selected))

              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {branch?.branch || 'Selecionar Filial'}
                  </Typography>
                </Box>
              )
            }}
          >
            <ModernMenuItem value="(TODAS)">
              <Business sx={{ fontSize: 16, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Todas as Filiais
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Visualizar dados consolidados
                </Typography>
              </Box>
            </ModernMenuItem>
            
            {branches.map((branch, index) => (
              <ModernMenuItem key={index} value={String(branch.branchId)}>
                <LocationOn sx={{ fontSize: 16, color: '#1976d2' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {branch.branch}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    ID: {branch.branchId}
                  </Typography>
                </Box>
              </ModernMenuItem>
            ))}
          </Select>
        </ResponsiveFormControl>
      )}
    </Box>
  )
}
