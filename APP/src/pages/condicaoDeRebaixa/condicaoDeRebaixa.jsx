import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Typography,
  Button,
  CircularProgress,
  TablePagination,
  TextField,
  Autocomplete,
  Box,
  Collapse,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Stack,
  Alert,
  LinearProgress,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  FilterList,
  Add,
  Close,
  DoNotDisturb,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  TrendingDown,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useCombo } from '../../features/combo';
import { useCommercial } from '../../contexts/CommercialContext';
import { format, parseISO } from 'date-fns';
import { exportToExcel } from '../../utils/utilsExcel';
import * as XLSX from 'xlsx';
import { getApiInstance } from '../../services/api';
import { CommercialService } from '../../services/CommercialService';
import AdicionarCondicaoModal from './components/adicionarCondicaoModal';

// New components and hooks
import { 
  PageContainer, 
  SurfaceCard, 
  ActionButton, 
  FiltersPanel,
  EmptyState,
  LoadingState,
  StatCard,
  DetailsGrid
} from '../../components/ui';
import { DemoteRow } from '../../components/business/DemoteRow';
import { ConditionCard } from '../../components/business/ConditionCard';
import { SupplierInfo } from '../../components/business/SupplierInfo';
import { DemoteSummary } from '../../components/business/DemoteSummary';
import { useTableState } from '../../hooks/useTableState';
import { useFormFilters } from '../../hooks/useFormFilters';
import { useDemoteCalculations } from '../../hooks/useDemoteCalculations';
import { formatCurrency, formatPercent, formatDateBR, formatDateTimeBR } from '../../utils/formatters';
import { parseCurrencyToNumber, formatCurrencyInput } from '../../utils/currency';
import { calculateMarginUnit, calculateCostWithDemote } from '../../utils/calculations';
import { useFeedback } from '../../contexts/FeedbackContext';


export const CondicaoDeRebaixa = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { showMessage } = useFeedback();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    getValues
  } = useForm({
    defaultValues: {
      conditionId: [],
      supplierId: null,
      productId: null
    }
  });

  const supplier = watch('supplierId');
  const condition = watch('conditionId');
  const product = watch('productId');

  const {
    fetchProductSuppliers,
    productSuppliers,
    fetchBranches,
    branches,
    fetchProducts,
    products,
    fetchDemotionConditions,
    demotionConditions,
    fetchRebateConditions,
    rebateConditions
  } = useCombo();
  
  const { loading, resetCommercial, buscaDemotes, demotes, gravaDemotes, setDemotes } = useCommercial();

  // Custom hooks
  const { showFilters, toggleFilters, getFiltersWithBranch } = useFormFilters({
    initialFilters: { conditionId: [], supplierId: null, productId: null }
  });

  const { 
    totals, 
    calculatedMargin, 
    updateAllDemoteValues, 
    demotesAllValue, 
    setDemotesAllValue 
  } = useDemoteCalculations({
    demotes,
    onDemotesChange: setDemotes
  });

  const {
    paginatedData: paginatedDemotes,
    pagination,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRequestSort,
    sortConfig
  } = useTableState({
    data: demotes,
    defaultRowsPerPage: isMobile ? 5 : 10
  });

  const [dados, setDados] = useState(null);
  const [conditionLoading, setConditionLoading] = useState(false);
  const [conditionError, setConditionError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAdicionarCondicaoModal, setShowAdicionarCondicaoModal] = useState(false);
  const [condicaoParaEditar, setCondicaoParaEditar] = useState(null);

  // Itens da condição (novos endpoints)
  const [conditionItems, setConditionItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [savingItems, setSavingItems] = useState(false);
  // Linhas exibidas na tabela: junção de produtos do fornecedor com itens existentes
  const [rows, setRows] = useState([]);
  const [bulkValue, setBulkValue] = useState('');
  const [itemsExpanded, setItemsExpanded] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', message: '', type: 'info' });

  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return (rows || []).slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [rows, pageSize]);

  // Existe condição ativa carregada?
  const hasActiveCondition = useMemo(() => {
    return Array.isArray(dados) && dados.some(c => Boolean(c?.isActive));
  }, [dados]);

  // Mapa de condições para performance otimizada
  const conditionMap = useMemo(() => {
    if (!Array.isArray(rebateConditions)) return new Map();
    return new Map(rebateConditions.map(c => [c.id, c.condition]));
  }, [rebateConditions]);

  const getFiltrosComFilialSelecionada = () => {
    const filtrosFormulario = getValues();
    const filialSelecionada = localStorage.getItem('selectedBranchId');
    
    const filtros = {
      ...filtrosFormulario,
      branchId: filialSelecionada && 
                filialSelecionada !== '(TODAS)' && 
                filialSelecionada !== 'null' && 
                filialSelecionada !== 'undefined'
        ? filialSelecionada 
        : filtrosFormulario.branchId || ''
    };
    
    return filtros;
  };


  const handleValorChangeAll = value => {
    updateAllDemoteValues(value);
  };

  const handleEditarCondicao = (condicao) => {
    setCondicaoParaEditar(condicao);
    setShowAdicionarCondicaoModal(true);
  };

  const handleFecharModal = () => {
    setShowAdicionarCondicaoModal(false);
    setCondicaoParaEditar(null);
  };

  const handleExportExcel = useCallback(() => {
    if (!dados && !demotes?.length) return;

    const wb = XLSX.utils.book_new();

    if (dados) {
      const dadosParaExport = Array.isArray(dados) ? dados : [dados];
      const detailSheet = XLSX.utils.json_to_sheet(dadosParaExport);
      XLSX.utils.book_append_sheet(wb, detailSheet, 'Resumo');
    }

    if (demotes?.length) {
      const prodSheet = XLSX.utils.json_to_sheet(demotes);
      XLSX.utils.book_append_sheet(wb, prodSheet, 'Produtos');
    }

    const filters = getValues();
    const fileName = `condicao-rebaixa-${filters?.supplierId || 'sem-fornecedor'}-${filters?.conditionId || ''}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }, [dados, demotes, getValues]);

  const handleFiltrar = useCallback(async () => {
    const formData = getValues();
    const conditionId = Array.isArray(formData.conditionId) ? formData.conditionId[0] : formData.conditionId;
    const supplierId = formData.supplierId;

    if (!conditionId || !supplierId) {
      setConditionError('Selecione Condição e Fornecedor para filtrar');
      return;
    }

    setConditionLoading(true);
    setConditionError(null);
    
    try {
      const api = getApiInstance();
      const res = await api.get('/Commercial/ConditionDemotes', {
        params: { conditionId: Number(conditionId), supplierId: Number(supplierId) }
      });
      
      const body = res.data;
      const payload = Array.isArray(body) ? body : (body ? [body] : []);
      setDados(payload);

      // Buscar itens SOMENTE se a condição existir e estiver ativa
      const isActive = payload.some(c => Boolean(c?.isActive));
      if (isActive) {
        await fetchConditionItems({ conditionId: Number(conditionId), supplierId: Number(supplierId), productId: null });
      } else {
        setConditionItems([]);
        setRows([]);
      }
    } catch (e) {
      setConditionError(e?.response?.data?.message || e?.message || 'Falha ao carregar dados');
      setDados(null);
      setConditionItems([]);
    } finally {
      setConditionLoading(false);
    }
  }, [getValues]);

  // Buscar itens da condição (GET /Commercial/ConditionItemDemotes)
  const fetchConditionItems = useCallback(async ({ conditionId, supplierId, productId }) => {
    if (!conditionId || !supplierId) return;
    setItemsLoading(true);
    try {
      const params = {
        conditionId: Number(conditionId),
        supplierId: Number(supplierId)
      };
      if (productId) params.productId = Number(productId);

      const list = await CommercialService.GetConditionItemDemotes(params);
      const safeList = Array.isArray(list) ? list : (list ? [list] : []);
      setConditionItems(safeList);
    } catch (error) {
      console.error('Erro ao buscar itens da condição:', error);
      setConditionItems([]);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // Monta linhas da tabela APENAS com produtos que estão cadastrados na condição
  useEffect(() => {
    // Se não houver itens cadastrados, limpa a tabela
    if (!conditionItems || conditionItems.length === 0) {
      setRows([]);
      return;
    }

    // Mapeia apenas os produtos que estão em conditionItems
    const mapped = conditionItems.map(item => {
      // Busca informações complementares do produto, se disponível
      const productInfo = products?.find(p => Number(p.productId) === Number(item.productId));
      
      return {
        productId: Number(item.productId),
        product: item.product || productInfo?.product || String(item.productId),
        demotesValue: '', // Campo editável começa vazio
        valorRebaixa: item.demotesValue || 0, // Valor fixo do banco
        registrationDate: item.registrationDate || null,
        lastUpdate: item.lastUpdate || null,
        selected: false,
        id: item.id || null // ID do item existente para atualização
      };
    });

    setRows(mapped);
  }, [products, conditionItems]);

  const handleChangeRowValue = (productId, value) => {
    setRows(prev => prev.map(r => r.productId === productId ? { ...r, demotesValue: formatCurrencyInput(value || '') } : r));
  };

  const handleApplyBulk = () => {
    setRows(prev => prev.map(r => r.selected ? { ...r, demotesValue: formatCurrencyInput(bulkValue || '') } : r));
  };

  const handleToggleRow = (productId, checked) => {
    setRows(prev => prev.map(r => r.productId === productId ? { ...r, selected: checked } : r));
  };

  const handleToggleAll = (checked) => {
    setSelectAll(checked);
    setRows(prev => prev.map(r => ({ ...r, selected: checked })));
  };

  // Limita tamanho de strings para atender validações do backend
  const limitString = (str, max) => {
    if (str === null || str === undefined) return '';
    const s = String(str).trim();
    return s.length > max ? s.slice(0, max) : s;
  };

  const handleSaveItems = async () => {
    const formData = getValues();
    const conditionId = Array.isArray(formData.conditionId) ? formData.conditionId[0] : formData.conditionId;
    const supplierId = formData.supplierId;

    if (!conditionId || !supplierId) {
      showMessage('Selecione Condição e Fornecedor para salvar.', 'warning');
      return;
    }

  const conditionName = (rebateConditions || []).find(c => c.id === Number(conditionId))?.condition || '';
  const supplierName = (productSuppliers || []).find(s => Number(s.supplierId) === Number(supplierId))?.supplier || '';
  const conditionText = limitString(conditionName || String(conditionId), 30);
  const supplierText = limitString(supplierName || String(supplierId), 30);

    const items = rows
      .filter(r => r.selected)
      .map(r => ({
        ...r,
        demotesValueNumber: parseCurrencyToNumber(r.demotesValue)
      }))
      .filter(r => r.demotesValueNumber && r.demotesValueNumber > 0)
      .map(r => {
        const payload = {
          // Backend exige product, supplier e condition (strings) além dos IDs
          conditionId: Number(conditionId),
          condition: conditionText,
          supplierId: Number(supplierId),
          supplier: supplierText,
          productId: Number(r.productId),
          product: r.product || String(r.productId),
          demotesValue: r.demotesValueNumber,
          usedCreditAmount: 0,
          registrationDate: r.registrationDate || new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
          conditionDemoteId: (Array.isArray(dados) && dados.length) ? Number(dados[0]?.id || 0) : 0
        };
        
        // Só adiciona o ID se o item já existir (atualização)
        // Para novos itens, omite o campo ID
        if (r.id && r.id > 0) {
          payload.id = Number(r.id);
        }
        
        return payload;
      });

    if (items.length === 0) {
      showMessage('Informe ao menos um valor de rebaixa para salvar.', 'warning');
      return;
    }

    setSavingItems(true);
    try {
      const resp = await CommercialService.PostConditionItemDemotes(items);
      const isOkArray = Array.isArray(resp) && resp.every(r => r?.isValid || (r?.hasNoWarnings && !(r?.erros?.length)));

      if (isOkArray) {
        showMessage(`${items.length} item(ns) salvo(s) com sucesso!`, 'success');
        await fetchConditionItems({ conditionId: Number(conditionId), supplierId: Number(supplierId), productId: null });
      } else if (Array.isArray(resp)) {
        const errors = [];
        const warns = [];
        resp.forEach(r => {
          (r?.erros || []).forEach(e => errors.push(e?.message || e?.key));
          (r?.warnings || []).forEach(w => warns.push(w?.message || w?.key));
        });
        const errorList = errors.length ? errors.join(', ') : '';
        const warnList = warns.length ? warns.join(', ') : '';
        const msg = [errorList, warnList].filter(Boolean).join('. ');
        setDialogConfig({ 
          title: 'Atenção', 
          message: msg || 'Falha ao salvar itens.', 
          type: 'error' 
        });
        setDialogOpen(true);
      } else {
        showMessage('Resposta inesperada do servidor ao salvar itens.', 'error');
      }
    } finally {
      setSavingItems(false);
    }
  };

  const onSubmit = data => {
    try {
      const savedBranch = window.localStorage.getItem('selectedBranchId');
      if (savedBranch && savedBranch !== '(TODAS)' && savedBranch !== 'null')
        data.branchId = savedBranch;

      if (data.stateAcronym == 'todos') {
        data.stateAcronym = null;
      }

      if (data.conditionId && Array.isArray(data.conditionId)) {
        data.conditionId = data.conditionId.join(',');
      }

      buscaDemotes(data);
      handleFiltrar();
      setDemotesAllValue(0);
      toggleFilters();
    } catch (error) {
      console.error('Erro no envio do formulário:', error);
    }
  };

  const handleClearFilters = () => {
    reset({ conditionId: [], supplierId: null, productId: null });
    setDados(null);
    setDemotes([]);
    setConditionError(null);
    setDemotesAllValue(0);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const promises = [];
        
        if (!productSuppliers) {
          promises.push(fetchProductSuppliers());
        }
        if (!branches) {
          promises.push(fetchBranches());
        }
        if (!rebateConditions) {
          promises.push(fetchRebateConditions());
        }

        if (promises.length > 0) {
          await Promise.allSettled(promises);
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    return () => {
      setDemotes([]);
    };
  }, []);

  if (initialLoading) {
    return (
      <PageContainer>
        <SurfaceCard sx={{ mb: 3 }}>
          <LoadingState message="Carregando dados..." fullHeight />
        </SurfaceCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <SurfaceCard sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#333', 
              mb: 1,
              fontSize: { xs: '24px', md: '32px' }
            }}>
              Condição de Rebaixa
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', fontSize: '16px' }}>
              Gerencie valores de rebaixa para produtos e fornecedores
            </Typography>
          </Box>
        </Box>

        {/* Botão de Filtros */}
        <ActionButton
          tone="primary"
          onClick={toggleFilters}
          startIcon={showFilters ? <Close /> : <FilterList />}
          sx={{ mb: 2 }}
        >
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </ActionButton>

        {/* Filtros */}
        {showFilters && (
          <FiltersPanel sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              color: '#333', 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <FilterList sx={{ color: '#1976d2' }} />
              Filtros de Pesquisa
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="conditionId"
                    control={control}
                    rules={{ required: 'A condição de Rebaixa é obrigatória' }}
                    defaultValue={[]}
                    render={({ field, fieldState }) => {
                      const fieldValue = Array.isArray(field.value) ? field.value : [];
                      const options = Array.isArray(rebateConditions) ? rebateConditions : [];
                      
                      return (
                        <Autocomplete
                          multiple
                          options={options}
                          getOptionLabel={option => option?.condition || ''}
                          value={options.filter(c => fieldValue.includes(c?.id))}
                          onChange={(_, selectedOptions) => {
                            try {
                              const selectedIds = selectedOptions?.map(opt => opt?.id).filter(v => v !== undefined && v !== null) || [];
                              field.onChange(selectedIds);
                            } catch (error) {
                              console.error('Erro no onChange do Autocomplete:', error);
                              field.onChange([]);
                            }
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label="Condição de Rebaixa"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              size={isMobile ? 'small' : 'medium'}
                              fullWidth
                            />
                          )}
                          isOptionEqualToValue={(option, value) => 
                            option?.id === value?.id
                          }
                          size={isMobile ? 'small' : 'medium'}
                          noOptionsText="Nenhuma condição encontrada"
                        />
                      );
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Controller
                    name="supplierId"
                    control={control}
                    rules={{ required: 'O fornecedor é obrigatório' }}
                    defaultValue={null}
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        options={productSuppliers || []}
                        getOptionLabel={option => option?.supplier || ''}
                        value={productSuppliers?.find(s => s.supplierId === field.value) || null}
                        onChange={(_, selectedOption) => {
                          const selectedId = selectedOption?.supplierId || null;
                          field.onChange(selectedId);
                          if (selectedId) {
                            fetchProducts(selectedId);
                          }
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Fornecedor"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size={isMobile ? 'small' : 'medium'}
                            fullWidth
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.supplierId === value.supplierId
                        }
                        size={isMobile ? 'small' : 'medium'}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <ActionButton
                    tone="primary"
                    type="submit"
                    startIcon={<Search />}
                    fullWidth
                    sx={{ height: isMobile ? '40px' : '56px' }}
                  >
                    Filtrar
                  </ActionButton>
                </Grid>
                <Grid item xs={12} md={2}>
                  <ActionButton
                    tone="secondary"
                    type="button"
                    startIcon={<DoNotDisturb />}
                    onClick={handleClearFilters}
                    fullWidth
                    sx={{ height: isMobile ? '40px' : '56px' }}
                  >
                    Limpar
                  </ActionButton>
                </Grid>
              </Grid>
            </form>
          </FiltersPanel>
        )}
      </SurfaceCard>

  {/* Seção de Dados da Condição de Rebaixa + Itens (inseridos dentro do mesmo container) */}
  <SurfaceCard sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2">
            Detalhes das Condições de Rebaixa
          </Typography>
          
          {!conditionLoading && dados && Array.isArray(dados) && dados.length > 0 && !dados.some(condicao => condicao.isActive) && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowAdicionarCondicaoModal(true)}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              Nova Condição
            </Button>
          )}
        </Box>

        {conditionLoading && <LinearProgress sx={{ mb: 2 }} />}

        {conditionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Falha ao carregar os dados. Tente novamente.
          </Alert>
        )}

        {!conditionLoading && dados && Array.isArray(dados) && dados.length > 0 ? (
          <Stack spacing={3}>
            {dados.map((condicao) => {
              const conditionName = conditionMap.get(condicao.conditionId) || condicao.conditionId;
              
              // Buscar nome do fornecedor para esta condição específica
              const fornecedor = (productSuppliers || []).find(
                item => Number(item?.supplierId) === Number(condicao?.supplierId)
              );
              const supplierName = fornecedor?.supplier || condicao?.supplier || '-';
              
              // Buscar nome da filial para esta condição específica
              const filial = (branches || []).find(
                item => Number(item?.branchId) === Number(condicao?.branchId)
              );
              const branchName = filial?.branch || condicao?.branch || '-';
              
              return (
                <Box key={condicao.id}>
                  <ConditionCard 
                    condicao={condicao} 
                    supplierName={supplierName}
                    branchName={branchName}
                    onEdit={() => handleEditarCondicao(condicao)}
                    conditionName={conditionName}
                  />

                  {/* Lista de Itens da Condição: renderizar APENAS se a condição estiver Ativa */}
                  {Boolean(condicao?.isActive) && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ mr: 1 }}>
                          Itens da Condição de Rebaixa
                        </Typography>
                        <Button
                          size="small"
                          startIcon={itemsExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          onClick={() => setItemsExpanded(prev => !prev)}
                          sx={{ textTransform: 'none' }}
                        >
                          {itemsExpanded ? 'Recolher' : 'Expandir'}
                        </Button>
                      </Box>

                      <Collapse in={itemsExpanded} timeout="auto" unmountOnExit>
                        {/* Aplicar valor geral para todos os produtos */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Aplicar rebaixa em todos (R$)"
                              value={bulkValue}
                              onChange={(e) => setBulkValue(formatCurrencyInput(e.target.value || ''))}
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              disabled={!selectAll}
                            />
                          </Grid>
                          {/* Removido 'Marcar todos' daqui; movido para o cabeçalho da tabela antes de Produtos */}
                          <Grid item xs={12} md="auto">
                            <ActionButton tone="secondary" onClick={handleApplyBulk}>Aplicar</ActionButton>
                          </Grid>
                          <Grid item xs={12} md="auto" sx={{ ml: 'auto' }}>
                            <ActionButton tone="primary" onClick={handleSaveItems} disabled={savingItems}>
                              {savingItems ? 'Salvando...' : 'Salvar'}
                            </ActionButton>
                          </Grid>
                        </Grid>

                        {itemsLoading ? (
                          <LinearProgress />
                        ) : (
                          <>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ minWidth: 180 }}>
                                    <FormControlLabel
                                      control={<Checkbox checked={selectAll} onChange={(e) => handleToggleAll(e.target.checked)} />}
                                      label="Marcar todos"
                                    />
                                  </TableCell>
                                  <TableCell>Produto</TableCell>
                                  <TableCell align="right">Rebaixa (R$)</TableCell>
                                  <TableCell align="right">Valor da rebaixa</TableCell>
                                  <TableCell>Rebaixa feita</TableCell>
                                  <TableCell>Registrado em</TableCell>
                                  <TableCell>Atualizado em</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(paginatedRows || []).map((r) => (
                                  <TableRow key={r.productId}>
                                    <TableCell>
                                      <Checkbox checked={!!r.selected} onChange={(e) => handleToggleRow(r.productId, e.target.checked)} />
                                    </TableCell>
                                    <TableCell>{r.product}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: 220 }}>
                                      <TextField
                                        value={r.demotesValue}
                                        onChange={(e) => handleChangeRowValue(r.productId, e.target.value)}
                                        placeholder="R$ 0,00"
                                        size="small"
                                        InputProps={{ inputProps: { style: { textAlign: 'right' } }, readOnly: !r.selected }}
                                        disabled={!r.selected}
                                      />
                                    </TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap', minWidth: 120 }}>
                                      {formatCurrency(r.valorRebaixa || 0)}
                                    </TableCell>
                                    <TableCell>
                                      {r.valorRebaixa > 0 ? (
                                        <Chip size="small" color="success" label="Feita" />
                                      ) : (
                                        <Chip size="small" variant="outlined" label="—" />
                                      )}
                                    </TableCell>
                                    <TableCell>{r.registrationDate ? formatDateTimeBR(r.registrationDate) : '-'}</TableCell>
                                    <TableCell>{r.lastUpdate ? formatDateTimeBR(r.lastUpdate) : '-'}</TableCell>
                                  </TableRow>
                                ))}
                                {(!rows || rows.length === 0) && (
                                  <TableRow>
                                    <TableCell colSpan={8}>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <DoNotDisturb fontSize="small" />
                                        <Typography variant="body2">Nenhum item cadastrado para esta condição.</Typography>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>

                            <TablePagination
                              component="div"
                              count={rows?.length || 0}
                              page={page}
                              onPageChange={(_, newPage) => setPage(newPage)}
                              rowsPerPage={pageSize}
                              onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                              rowsPerPageOptions={[10, 20, 30, 50, 100]}
                              labelRowsPerPage="Itens por página"
                              sx={{ mt: 1 }}
                            />
                          </>
                        )}
                      </Collapse>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <EmptyState
            hasFilters={Boolean(supplier || (Array.isArray(condition) && condition.length > 0))}
            onAdd={() => setShowAdicionarCondicaoModal(true)}
          />
        )}
      </SurfaceCard>

      {/* Estados de Loading e Vazio */}
      {loading && (
        <SurfaceCard sx={{ mb: 3 }}>
          <LoadingState message="Carregando dados..." fullHeight />
        </SurfaceCard>
      )}

      {/* Modal para Adicionar/Editar Condição */}
      <AdicionarCondicaoModal
        open={showAdicionarCondicaoModal}
        onClose={handleFecharModal}
        filtrosAtuais={getFiltrosComFilialSelecionada()}
        dadosParaEdicao={condicaoParaEditar}
        todasAsCondicoes={dados}
        onCondicaoSalva={handleFiltrar}
      />

      {/* Dialog customizado para mensagens */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogConfig.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default CondicaoDeRebaixa;
