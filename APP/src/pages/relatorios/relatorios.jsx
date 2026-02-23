import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { Search, Download } from '@mui/icons-material';
import { 
  PageContainer, 
  SurfaceCard, 
  ActionButton,
  StatCard,
  EmptyState,
  LoadingState
} from '../../components/ui';
import { ReportService } from '../../services/ReportService';
import { formatCurrency, formatPercent, formatDateBR } from '../../utils/formatters';
import { useFeedback } from '../../contexts/FeedbackContext';
import * as XLSX from 'xlsx';

const REPORT_TYPES = [
  { value: 'gestao-preco', label: 'Gestão de Preço' }
];

export const Relatorios = () => {
  const { showMessage } = useFeedback();
  const [selectedReport, setSelectedReport] = useState('');
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      showMessage('Selecione um tipo de relatório', 'warning');
      return;
    }

    if (!beginDate || !endDate) {
      showMessage('Selecione as datas inicial e final', 'warning');
      return;
    }

    if (beginDate > endDate) {
      showMessage('A data inicial não pode ser maior que a data final', 'warning');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Formatar datas para YYYY-MM-DD
      const formattedBeginDate = format(beginDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const data = await ReportService.getGestaoPreco({
        beginDate: formattedBeginDate,
        endDate: formattedEndDate
      });

      setReportData(data);
      showMessage('Relatório gerado com sucesso!', 'success');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao gerar relatório');
      showMessage('Erro ao gerar relatório', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData || !reportData.items || reportData.items.length === 0) {
      showMessage('Não há dados para exportar', 'warning');
      return;
    }

    const wb = XLSX.utils.book_new();
    
    // Dados do relatório
    const reportSheet = XLSX.utils.json_to_sheet(reportData.items);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Gestão de Preço');

    const fileName = `gestao-preco-${format(beginDate, 'dd-MM-yyyy')}-${format(endDate, 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    showMessage('Relatório exportado com sucesso!', 'success');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedItems = reportData?.items?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <PageContainer>
        {/* Header */}
        <SurfaceCard sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#333', 
            mb: 1,
            fontSize: { xs: '24px', md: '32px' }
          }}>
            Relatórios
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '16px' }}>
            Gere e visualize relatórios gerenciais
          </Typography>
        </SurfaceCard>

        {/* Filtros */}
        <SurfaceCard sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Filtros
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Tipo de Relatório"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                disabled={loading}
              >
                {REPORT_TYPES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Inicial"
                value={beginDate}
                onChange={(newValue) => setBeginDate(newValue)}
                disabled={loading}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Final"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                disabled={loading}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <ActionButton
                tone="primary"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={<Search />}
                fullWidth
                sx={{ height: '56px' }}
              >
                Gerar
              </ActionButton>
            </Grid>
          </Grid>
        </SurfaceCard>

        {/* Loading */}
        {loading && (
          <SurfaceCard>
            <LoadingState message="Gerando relatório..." />
          </SurfaceCard>
        )}

        {/* Error */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Resumo do Relatório */}
        {reportData && !loading && (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Total de Itens"
                  value={reportData.totalItems || 0}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Quantidade Total"
                  value={reportData.totalQuantity || 0}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Valor Total de Vendas"
                  value={formatCurrency(reportData.totalSalesValue || 0)}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <StatCard
                  title="Margem Média Atual"
                  value={formatPercent(reportData.averageCurrentMargin || 0)}
                  color="warning"
                />
              </Grid>
            </Grid>

            {/* Tabela de Dados */}
            <SurfaceCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Detalhamento
                </Typography>
                <ActionButton
                  tone="secondary"
                  onClick={handleExportExcel}
                  startIcon={<Download />}
                >
                  Exportar Excel
                </ActionButton>
              </Box>

              {reportData.items && reportData.items.length > 0 ? (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Filial</TableCell>
                          <TableCell>Data Emissão</TableCell>
                          <TableCell>Condição</TableCell>
                          <TableCell>Supervisor</TableCell>
                          <TableCell>Vendedor</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell align="right">Quantidade</TableCell>
                          <TableCell align="right">Preço Venda</TableCell>
                          <TableCell align="right">Custo</TableCell>
                          <TableCell align="right">Margem Atual</TableCell>
                          <TableCell align="right">Nova Margem</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.branchNickName}</TableCell>
                            <TableCell>{formatDateBR(item.invoiceIssueDate)}</TableCell>
                            <TableCell>{item.condition}</TableCell>
                            <TableCell>{item.supervisorNickName}</TableCell>
                            <TableCell>{item.sellerNickName}</TableCell>
                            <TableCell>{item.clientStateAcronym}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.salePriceUnit)}</TableCell>
                            <TableCell align="right">{formatCurrency(item.productCostPriceUnit)}</TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={formatPercent(item.currentMarginUnit)} 
                                size="small" 
                                color={item.currentMarginUnit > 0 ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={formatPercent(item.newMarginUnit)} 
                                size="small" 
                                color={item.newMarginUnit > 0 ? 'success' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={reportData.items.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage="Linhas por página"
                  />
                </>
              ) : (
                <EmptyState 
                  message="Nenhum dado encontrado para o período selecionado"
                />
              )}
            </SurfaceCard>
          </>
        )}

        {/* Empty State inicial */}
        {!reportData && !loading && !error && (
          <SurfaceCard>
            <EmptyState 
              message="Selecione os filtros e clique em Gerar para visualizar o relatório"
            />
          </SurfaceCard>
        )}
      </PageContainer>
    </LocalizationProvider>
  );
};

export default Relatorios;
