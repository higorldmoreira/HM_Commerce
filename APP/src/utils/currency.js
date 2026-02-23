/**
 * Currency - Utilitários para manipulação de moeda
 * Centraliza parsing e formatação de valores monetários
 */

/**
 * Remove caracteres não numéricos de uma string de moeda
 * @param {string} value - String com valor monetário
 * @returns {string} String apenas com números, vírgulas e pontos
 */
export const sanitizeCurrencyString = (value) => {
  if (!value) return '';
  
  return value
    .toString()
    .trim()
    .replace(/[R$r$]/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^\d.,-]/g, '');
};

/**
 * Converte string de moeda para número
 * @param {string} value - String com valor monetário
 * @returns {number} Valor numérico
 */
export const parseCurrencyToNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;

  const stringValue = value.toString().trim();
  if (!stringValue) return 0;

  // Remove R$, espaços e outros caracteres, mantendo apenas números, vírgulas e pontos
  let cleaned = stringValue
    .replace(/R\$/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^\d.,-]/g, '');

  if (!cleaned) return 0;

  // Se tem vírgula (formato brasileiro), substitui vírgula por ponto e remove pontos de milhares
  if (cleaned.includes(',')) {
    // Remove pontos (separadores de milhares) e substitui vírgula por ponto
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const numeric = parseFloat(cleaned);
  return isNaN(numeric) ? 0 : numeric;
};

/**
 * Formata valor para input de moeda (formato brasileiro)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado para input
 */
export const formatCurrencyInput = (value) => {
  // Se for valor vazio, nulo ou 0, retorna string vazia
  if (value === null || value === undefined || value === '' || value === 0) {
    return '';
  }

  const stringValue = value.toString();
  
  // Remove espaços, R$, pontos e outros caracteres, mantendo apenas dígitos
  let cleaned = stringValue
    .replace(/\s+/g, '')
    .replace(/R\$/gi, '')
    .replace(/\./g, '') // Remove pontos (separadores de milhares)
    .replace(/[^\d]/g, ''); // Mantém apenas dígitos

  // Se não sobrou nada ou é zero, retorna vazio
  if (!cleaned || cleaned === '0' || cleaned === '00') {
    return '';
  }

  // Converte para número (centavos)
  const numericValue = parseInt(cleaned, 10);
  if (isNaN(numericValue) || numericValue === 0) {
    return '';
  }
  
  // Converte centavos para reais (divide por 100)
  const realValue = numericValue / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(realValue);
};

/**
 * Sanitiza valor de moeda para input (remove caracteres inválidos)
 * @param {string} value - Valor a ser sanitizado
 * @returns {string} Valor sanitizado
 */
export const sanitizeRawCurrency = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  let normalized = value.toString().trim();

  if (!normalized) {
    return '';
  }

  normalized = normalized.replace(/\s/g, '');
  const endsWithComma = normalized.endsWith(',');
  normalized = normalized.replace(/[R$r$]/gi, '');
  normalized = normalized.replace(/\./g, '');
  normalized = normalized.replace(/[^0-9,]/g, '');

  if (!normalized) {
    return '';
  }

  const [integerPart = '', decimalPartRaw = ''] = normalized.split(',');
  const integerNormalized = integerPart.replace(/^0+(?=\d)/, '');
  const safeInteger = integerNormalized || (decimalPartRaw ? '0' : integerPart);
  const decimalPart = decimalPartRaw ? decimalPartRaw.slice(0, 2) : '';

  if (endsWithComma && !decimalPart) {
    return `${safeInteger || '0'},`;
  }

  return decimalPart ? `${safeInteger || '0'},${decimalPart}` : safeInteger || '';
};

/**
 * Valida se um valor monetário é válido
 * @param {string|number} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCurrency = (value) => {
  if (value === null || value === undefined || value === '') return true; // Vazio é válido
  
  const num = parseCurrencyToNumber(value);
  return isFinite(num) && num >= 0;
};

/**
 * Converte valor de input para número (tratando centavos)
 * @param {string} inputValue - Valor do input
 * @returns {number} Valor numérico
 */
export const parseInputToNumber = (inputValue) => {
  if (!inputValue) return 0;
  
  // Remove tudo exceto dígitos
  const digits = inputValue.replace(/\D/g, '');
  if (!digits) return 0;
  
  // Converte centavos para reais
  return Number(digits) / 100;
};
