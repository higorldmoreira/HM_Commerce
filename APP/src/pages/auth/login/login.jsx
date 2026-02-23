import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import * as s from './styledLogin'
import { useAuth } from '../../../contexts/AuthContext'
import logo from '../../../assets/Logo_HM.svg'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export const Login = () => {
  const { login } = useAuth()
  const isMobile = useMediaQuery('(max-width:768px)')
  // Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false)
  const [showError, setShowError] = useState()

  // Função para alternar a visibilidade da senha
  const handleToggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }
  // Configura o useForm do react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Função que lida com o envio do formulário
  const onSubmit = data => {
    login(data)
  }

  return (
    <s.ModernContainer>
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Seção da Logo e Título */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
              <s.ModernLogo src={logo} alt="Commerce Logo" />
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#1976d2',
                  mt: 2,
                  mb: 1
                }}
              >
                Commerce
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#666',
                  fontWeight: '300'
                }}
              >
                Sistema de gestão comercial.
              </Typography>
            </Box>
          </Grid>

          {/* Seção do Formulário */}
          <Grid item xs={12} md={6}>
            <s.ModernCard elevation={8}>
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {showError && (
                    <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                      {showError}
                    </Typography>
                  )}
                  
                  <s.ModernTextField
                    {...register('username', { required: 'Usuário é obrigatório' })}
                    id="username"
                    label="Digite seu usuário"
                    variant="outlined"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    sx={{ mb: 3 }}
                  />
                  
                  <s.ModernTextField
                    {...register('password', { required: 'Senha é obrigatória' })}
                    id="password"
                    label="Digite sua senha"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 2 }}
                  />
                  
                  <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={showPassword} 
                          onChange={handleToggleShowPassword}
                          sx={{ color: '#1976d2' }}
                        />
                      }
                      label="Mostrar sua senha"
                      sx={{ color: '#666' }}
                    />
                  </FormGroup>
                  
                  <s.ModernButton 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    size="large"
                  >
                    ENTRAR
                  </s.ModernButton>
                </form>
              </CardContent>
            </s.ModernCard>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <s.ModernFooter>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/Logo_HM.svg" alt="Logo" style={{ width: '35px', height: 'auto' }} />
          <Typography variant="caption" sx={{ color: '#666' }}>
            {new Date().getFullYear()} Commerce — Todos os direitos reservados
          </Typography>
        </Box>
      </s.ModernFooter>
    </s.ModernContainer>
  )
}
