import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Box,
  styled
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import { useCombo } from '../../../features/combo'
import { useCommercial } from '../../../contexts/CommercialContext'
import { useFeedback } from '../../../contexts/FeedbackContext'
import { getApiInstance } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatters'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    maxWidth: '700px',
    width: '100%'
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
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
  }
}))

const AdicionarCondicaoModal = ({ open, onClose, filtrosAtuais, dadosParaEdicao, todasAsCondicoes = [], onCondicaoSalva }) => {
  const { control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      id: '',
      conditionId: '',
      supplierId: '',
      branchId: '',
      description: '',
      beginDate: '',
      endDate: '',
      creditedAmount: '',
      debitedAmount: '',
      allowNegativeBalance: false,
      returnThresholdPercent: 0,
      isActive: true
    }
  })

  const { rebateConditions, productSuppliers, branches, fetchRebateConditions } = useCombo()
  const { criaCondicaoRebaixa, loading } = useCommercial()
  const { showMessage } = useFeedback()

  const creditedAmount = watch('creditedAmount')
  const debitedAmount = watch('debitedAmount')

  const isEditMode = Boolean(dadosParaEdicao)

  // Verifica se existe alguma condição ativa (excluindo a atual se estiver editando)
  const existeCondicaoAtiva = React.useMemo(() => {
    if (!Array.isArray(todasAsCondicoes)) return false
    return todasAsCondicoes.some(condicao => 
      condicao.isActive && 
      (!isEditMode || condicao.id !== dadosParaEdicao?.id)
    )
  }, [todasAsCondicoes, isEditMode, dadosParaEdicao])

  const isActiveValue = watch('isActive')

  const parseCurrencyToNumber = value => {
    if (value === null || value === undefined || value === '') return 0
    if (typeof value === 'number') return value

    const stringValue = value.toString().trim()
    if (!stringValue) return 0

    // Remove R$, espaços e outros caracteres, mantendo apenas números, vírgulas e pontos
    let cleaned = stringValue
      .replace(/R\$/gi, '')
      .replace(/\s+/g, '')
      .replace(/[^\d.,-]/g, '')

    if (!cleaned) return 0

    // Se tem vírgula (formato brasileiro), substitui vírgula por ponto e remove pontos de milhares
    if (cleaned.includes(',')) {
      // Remove pontos (separadores de milhares) e substitui vírgula por ponto
      cleaned = cleaned.replace(/\./g, '').replace(',', '.')
    }

    const numeric = parseFloat(cleaned)
    return isNaN(numeric) ? 0 : numeric
  }

  const formatCurrencyInput = value => {
    // Vazio/zero → string vazia (para entrada controlada visualmente)
    if (value === null || value === undefined || value === '' || value === 0) {
      return ''
    }

    // Valor numérico (provindo do backend) → apenas formata
    if (typeof value === 'number') {
      return formatCurrency(value)
    }

    // Entrada do usuário (string) → sempre modo centavos
    const digits = String(value)
      .replace(/\s+/g, '')
      .replace(/R\$/gi, '')
  .replace(/[.,]/g, '')
      .replace(/[^\d]/g, '')

    if (!digits) return ''

    const realValue = Number(digits) / 100
    return formatCurrency(realValue)
  }

  React.useEffect(() => {
    if (open) {
      if (!rebateConditions) {
        fetchRebateConditions()
      }
    }
  }, [open, rebateConditions, fetchRebateConditions])

  // PREENCHIMENTO AUTOMÁTICO - Comunicação Pai → Filho via Props
  React.useEffect(() => {
    // Executa apenas quando o modal abre
    if (open) {
      // Se for modo de edição, os dados são tratados por outro useEffect
      if (isEditMode) return;
      
      // Modo de criação: preenche com os filtros da tela principal
      console.log('✨ Modo de criação: Preenchendo modal com filtros:', filtrosAtuais);

      // 1. Define o Fornecedor
      const supplierId = filtrosAtuais?.supplierId || null;
      if (supplierId) {
        console.log('🏢 Preenchendo supplierId:', supplierId);
        setValue('supplierId', supplierId);
      }

      // 2. Define a Condição de Rebaixa
      const conditionId = filtrosAtuais?.conditionId;
      if (Array.isArray(conditionId) && conditionId.length > 0) {
        // Se o filtro for múltiplo, pega o primeiro item
        console.log('📋 Preenchendo conditionId (array → primeiro):', conditionId[0]);
        setValue('conditionId', conditionId[0]);
      } else if (conditionId) {
        // Se for um valor único
        console.log('📋 Preenchendo conditionId (valor único):', conditionId);
        setValue('conditionId', conditionId);
      }

      // 3. Define a Filial (prioridade: filtros → localStorage)
      const branchId = filtrosAtuais?.branchId || null;
      if (branchId && branchId !== '(TODAS)' && branchId !== '' && branchId !== 'null') {
        console.log('🏪 Preenchendo branchId dos filtros:', branchId);
        setValue('branchId', Number(branchId));
      } else {
        // Fallback para localStorage se não vier dos filtros
        const storedBranchId = localStorage.getItem('selectedBranchId');
        if (storedBranchId && storedBranchId !== 'null' && storedBranchId !== '(TODAS)') {
          console.log('🏪 Preenchendo branchId do localStorage:', storedBranchId);
          setValue('branchId', Number(storedBranchId));
        } else {
          console.log('🏪 Limpando branchId (sem valor válido)');
          setValue('branchId', '');
        }
      }

    } else {
      // Quando o modal fecha, reseta para os valores padrão limpos
      console.log('🔄 Modal fechado: resetando formulário');
      reset({
        id: '',
        conditionId: '',
        supplierId: '',
        branchId: '',
        description: '',
        beginDate: '',
        endDate: '',
        creditedAmount: '',
        debitedAmount: '',
        allowNegativeBalance: false,
        returnThresholdPercent: 0,
        isActive: true
      });
    }
  }, [open, filtrosAtuais, isEditMode, setValue, reset])

  React.useEffect(() => {
    if (open && dadosParaEdicao && isEditMode) {
      
      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        try {
          const date = new Date(dateString)
          return date.toISOString().split('T')[0]
        } catch {
          return ''
        }
      }

      reset({
        id: dadosParaEdicao.id || '',
        conditionId: dadosParaEdicao.conditionId || '',
        supplierId: dadosParaEdicao.supplierId || '',
        branchId: dadosParaEdicao.branchId || '',
        description: dadosParaEdicao.description || '',
        beginDate: formatDateForInput(dadosParaEdicao.beginDate),
        endDate: formatDateForInput(dadosParaEdicao.endDate),
        creditedAmount: formatCurrencyInput(dadosParaEdicao.creditedAmount),
        debitedAmount: formatCurrencyInput(dadosParaEdicao.debitedAmount),
        allowNegativeBalance: Boolean(dadosParaEdicao.allowNegativeBalance),
        returnThresholdPercent: dadosParaEdicao.returnThresholdPercent || 0,
        isActive: Boolean(dadosParaEdicao.isActive)
      })
    }
  }, [open, dadosParaEdicao, isEditMode, reset])



  const calcularSaldo = () => {
    const credited = parseCurrencyToNumber(creditedAmount)
    const debited = parseCurrencyToNumber(debitedAmount)
    return credited - debited
  }

  // Dentro de /src/pages/bi/condicaoDeRebaixa/components/adicionarCondicaoModal.jsx

  const onSubmit = async data => {
    const storedBranchId = localStorage.getItem('selectedBranchId')
    const normalizedStoredBranch = storedBranchId && storedBranchId !== 'null' && storedBranchId !== '(TODAS)' ? storedBranchId : null
    const formBranchId = data.branchId ? data.branchId : null
    const effectiveBranchId = formBranchId || normalizedStoredBranch

    if (!effectiveBranchId) {
      showMessage('Por favor, selecione uma filial específica para salvar a condição.', 'warning')
      return
    }

    console.log('Debug - Form data received:', data)
    console.log('Debug - creditedAmount raw:', data.creditedAmount)
    console.log('Debug - debitedAmount raw:', data.debitedAmount)
    console.log('Debug - creditedAmount parsed:', parseCurrencyToNumber(data.creditedAmount))
    console.log('Debug - debitedAmount parsed:', parseCurrencyToNumber(data.debitedAmount))
    
    const payload = {
        ...data,
        branchId: Number(effectiveBranchId),
        creditedAmount: parseCurrencyToNumber(data.creditedAmount),
        debitedAmount: parseCurrencyToNumber(data.debitedAmount),
        returnThresholdPercent: parseFloat(data.returnThresholdPercent) || 0,
        beginDate: data.beginDate ? new Date(data.beginDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        allowNegativeBalance: Boolean(data.allowNegativeBalance),
        isActive: Boolean(data.isActive)
    }

    console.log('Debug - Final payload:', payload)

    if (isEditMode && data.id && data.id !== '') {
      payload.id = Number(data.id)
    } else {
      delete payload.id
    }

    // Validação final antes de enviar
    if (payload.isActive && existeCondicaoAtiva) {
      showMessage('❌ Não é possível ativar esta condição. Já existe uma condição ativa.', 'error');
      return;
    }

    try {
        if (isEditMode) {
            // A lógica de EDIÇÃO permanece, pois usa uma chamada direta à API
            const api = getApiInstance();
            const response = await api.post(`/Commercial/ConditionDemotes`, [payload]);
            const responseData = response?.data;
            const isSuccess = (Array.isArray(responseData) && responseData.length === 0) ||
                (Array.isArray(responseData) && responseData.length > 0 && responseData[0].isValid);

            if (isSuccess) {
                showMessage('✅ Condição atualizada com sucesso!', 'success');
                handleClose();
                // Recarrega os dados na tela principal
                if (onCondicaoSalva) onCondicaoSalva();
            } else if (Array.isArray(responseData) && responseData.length > 0 && !responseData[0].isValid) {
                const result = responseData[0];
                const errorMessage = result.erros?.map(e => e.message).join('; ') || 'Erro na validação dos dados.';
                showMessage(`❌ ${errorMessage}`, 'error');
            } else {
                throw new Error('Resposta inesperada ao atualizar a condição.');
            }
        } else {
            // LÓGICA DE CRIAÇÃO SIMPLIFICADA
            // Se a função abaixo falhar, ela vai lançar um erro e pular para o catch.
            // Se ela completar, significa que foi um sucesso.
            await criaCondicaoRebaixa(payload);

            showMessage('✅ Condição gravada com sucesso!', 'success');
            handleClose();
            // Recarrega os dados na tela principal
            if (onCondicaoSalva) onCondicaoSalva();
        }
    } catch (error) {
        // O bloco CATCH agora só lida com erros reais, e já funciona bem.
        console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} condição:`, error);

        let specificMessage = null;
        const errorData = error.response?.data;
        if (Array.isArray(errorData) && errorData.length > 0 && errorData[0].erros?.length > 0) {
            specificMessage = errorData[0].erros.map(e => e.message).join('; ');
        } else if (error.message) {
            specificMessage = error.message;
        }

        const acao = isEditMode ? 'atualizar' : 'criar';
        const finalMessage = specificMessage && !specificMessage.toLowerCase().includes('request failed') ?
            specificMessage :
            `Erro ao ${acao} condição. Tente novamente.`;

        showMessage(`❌ ${finalMessage}`, 'error');
    }
};
  const handleClose = () => {
    reset({
      id: '',
      conditionId: '',
      supplierId: '',
      branchId: '',
      description: '',
      beginDate: '',
      endDate: '',
      creditedAmount: '',
      debitedAmount: '',
      allowNegativeBalance: false,
      returnThresholdPercent: 0,
      isActive: true
    })
    onClose()
  }

  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #E0E0E0',
        pb: 2,
        fontWeight: 600, 
        color: '#333'
      }}>
        {isEditMode ? 'Editar Condição de Rebaixa' : 'Nova Condição de Rebaixa'}
        <IconButton onClick={handleClose} sx={{ color: '#666' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="conditionId"
                control={control}
                rules={{ required: 'Condição é obrigatória' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Condição</InputLabel>
                    <Select {...field} label="Condição">
                      {rebateConditions?.map((condition) => (
                        <MenuItem key={condition.id} value={condition.id}>
                          {condition.condition}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="supplierId"
                control={control}
                rules={{ required: 'Fornecedor é obrigatório' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Fornecedor</InputLabel>
                    <Select {...field} label="Fornecedor">
                      {productSuppliers?.map((supplier) => (
                        <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                          {supplier.supplier}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="branchId"
                control={control}
                rules={{ required: 'Filial é obrigatória' }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Filial</InputLabel>
                    <Select {...field} label="Filial">
                      {branches?.map((branch) => (
                        <MenuItem key={branch.branchId} value={branch.branchId}>
                          {branch.branch}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="description"
                control={control}
                rules={{ 
                  required: 'Descrição é obrigatória',
                  maxLength: { value: 150, message: 'Máximo 150 caracteres' }
                }}
                render={({ field, fieldState }) => (
                  <StyledTextField
                    {...field}
                    label="Descrição"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ maxLength: 150 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="beginDate"
                control={control}
                rules={{ required: 'Data de início é obrigatória' }}
                render={({ field, fieldState }) => (
                  <StyledTextField
                    {...field}
                    label="Data de Início"
                    type="date"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                    disabled={isEditMode}
                    inputProps={!isEditMode ? { min: new Date().toISOString().split('T')[0] } : {}}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'Data de fim é obrigatória' }}
                render={({ field, fieldState }) => (
                  <StyledTextField
                    {...field}
                    label="Data de Fim"
                    type="date"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="creditedAmount"
                control={control}
                rules={{ 
                  required: 'Valor creditado é obrigatório',
                  min: { value: 0.01, message: 'Valor mínimo é R$ 0,01' }
                }}
                render={({ field, fieldState }) => {
                  const handleChange = event => {
                    const formatted = formatCurrencyInput(event.target.value)
                    field.onChange(formatted)
                  }

                  const handleKeyDown = e => {
                    if (e.key === 'Backspace') {
                      e.preventDefault()
                      const digits = (field.value || '').replace(/\D/g, '')
                      const next = digits.length > 0 ? digits.slice(0, -1) : ''
                      field.onChange(formatCurrencyInput(next))
                    }
                  }

                  return (
                    <StyledTextField
                      label="Valor Creditado (R$)"
                      value={field.value || ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      inputProps={{ inputMode: 'numeric' }}
                      placeholder="R$ 0,00"
                    />
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="debitedAmount"
                control={control}
                render={({ field }) => {
                  const handleChange = event => {
                    const formatted = formatCurrencyInput(event.target.value)
                    field.onChange(formatted)
                  }

                  const handleKeyDown = e => {
                    if (e.key === 'Backspace') {
                      e.preventDefault()
                      const digits = (field.value || '').replace(/\D/g, '')
                      const next = digits.length > 0 ? digits.slice(0, -1) : ''
                      field.onChange(formatCurrencyInput(next))
                    }
                  }

                  return (
                    <StyledTextField
                      label="Valor Debitado (R$)"
                      value={field.value || ''}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      fullWidth
                      disabled={!isEditMode}
                      inputProps={{ inputMode: 'numeric' }}
                      placeholder="R$ 0,00"
                    />
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                label="Saldo Disponível"
                value={formatCurrency(calcularSaldo())}
                fullWidth
                disabled
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="returnThresholdPercent"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    {...field}
                    label="Percentual de Retorno (%)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="allowNegativeBalance"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch 
                        {...field} 
                        checked={field.value}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            },
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#1976d2',
                          },
                        }}
                      />
                    }
                    label="Permitir Saldo Negativo"
                    sx={{ 
                      '& .MuiFormControlLabel-label': {
                        fontSize: '14px',
                        color: '#333'
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          {...field} 
                          checked={field.value}
                          disabled={existeCondicaoAtiva && !field.value}
                          onChange={(e) => {
                            // Se está tentando ativar e já existe uma condição ativa
                            if (e.target.checked && existeCondicaoAtiva) {
                              alert('❌ Não é possível ativar esta condição.\n\nJá existe uma condição ativa. Apenas uma condição pode estar ativa por vez.')
                              return
                            }
                            field.onChange(e.target.checked)
                          }}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#4caf50',
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#4caf50',
                            },
                          }}
                        />
                      }
                      label="Condição Ativa"
                      sx={{ 
                        '& .MuiFormControlLabel-label': {
                          fontSize: '14px',
                          color: existeCondicaoAtiva && !field.value ? '#999' : '#333'
                        }
                      }}
                    />
                    
                    {/* Mensagem informativa */}
                    {existeCondicaoAtiva && !field.value && (
                      <Typography 
                        variant="caption" 
                        color="warning.main" 
                        sx={{ 
                          display: 'block', 
                          mt: 0.5, 
                          fontSize: '12px',
                          fontStyle: 'italic'
                        }}
                      >
                        ⚠️ Já existe uma condição ativa. Apenas uma pode estar ativa por vez.
                      </Typography>
                    )}
                    
                    {field.value && (
                      <Typography 
                        variant="caption" 
                        color="success.main" 
                        sx={{ 
                          display: 'block', 
                          mt: 0.5, 
                          fontSize: '12px',
                          fontStyle: 'italic'
                        }}
                      >
                        ✅ Esta condição será a condição ativa do sistema.
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #E0E0E0',
        gap: 2 
      }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#E0E0E0',
            color: '#666',
            '&:hover': {
              borderColor: '#BDBDBD',
              backgroundColor: '#F5F5F5'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          variant="contained" 
          disabled={loading}
          sx={{
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            },
            '&:disabled': {
              backgroundColor: '#BDBDBD'
            }
          }}
        >
          {loading 
            ? (isEditMode ? 'Atualizando...' : 'Salvando...') 
            : (isEditMode ? 'Atualizar Condição' : 'Salvar Condição')
          }
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default AdicionarCondicaoModal
