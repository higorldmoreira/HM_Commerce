/**
 * Formatters - Funções de formatação centralizadas
 * Consolida todas as funções de formatação do projeto
 */

// Formatação de moeda
const BRL = new Intl.NumberFormat('pt-BR', { 
  style: 'currency', 
  currency: 'BRL' 
});

const PCT = new Intl.NumberFormat('pt-BR', { 
  style: 'percent', 
  maximumFractionDigits: 2 
});

/**
 * Formata um valor como moeda brasileira
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda
 */
export const formatCurrency = (value) => {
  const num = Number(value ?? 0);
  return BRL.format(num);
};

/**
 * Formata um valor como porcentagem
 * @param {number|string} value - Valor a ser formatado (0-100)
 * @returns {string} Valor formatado como porcentagem
 */
export const formatPercent = (value) => {
  const num = Number(value ?? 0);
  return PCT.format(num / 100);
};

/**
 * Formata um valor como porcentagem com 2 casas decimais
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado como porcentagem
 */
export const formatPercentFixed = (value) => {
  if (value === null || value === undefined) return '0,00%';
  const num = typeof value === 'string' ? Number(value) : value;
  if (!isFinite(num)) return '0,00%';
  
  return `${new Intl.NumberFormat('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(num)}%`;
};

/**
 * Formata uma data para o padrão brasileiro (dd/MM/yyyy)
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data formatada ou '-' se inválida
 */
export const formatDateBR = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data e hora para o padrão brasileiro
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data e hora formatada ou '-' se inválida
 */
export const formatDateTimeBR = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('pt-BR');
};

/**
 * Formata uma data para input de tipo date (yyyy-MM-dd)
 * @param {string|Date} dateString - Data a ser formatada
 * @returns {string} Data formatada para input ou string vazia
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Formata um número com separadores de milhares
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Número formatado
 */
export const formatNumber = (value) => {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat('pt-BR').format(num);
};

/**
 * Formata um valor monetário seguro (com fallback)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda ou R$ 0,00
 */
export const formatCurrencySafe = (value) => {
  const num = Number(value ?? 0);
  if (!isFinite(num)) return 'R$ 0,00';
  return BRL.format(num);
};

// Aliases para compatibilidade com código existente
export const formatarValorParaBRL = formatCurrencySafe;
export const fmtPercent = formatPercentFixed;
export const fmtDateBR = formatDateBR;
export const fmtDateTimeBR = formatDateTimeBR;
