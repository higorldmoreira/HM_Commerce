/**
 * Calculations - Cálculos de negócio centralizados
 * Consolida todas as funções de cálculo do projeto
 */

/**
 * Calcula margem unitária
 * @param {number} costValue - Valor do custo
 * @param {number} salePrice - Preço de venda
 * @returns {number} Margem em porcentagem
 */
export const calculateMarginUnit = (costValue, salePrice) => {
  if (!salePrice || salePrice === 0) return 0;
  return ((costValue / salePrice - 1) * -1 * 100);
};

/**
 * Calcula margem com rebaixa
 * @param {number} averageCost - Custo médio
 * @param {number} demoteValue - Valor da rebaixa
 * @param {number} salePrice - Preço de venda
 * @returns {number} Nova margem em porcentagem
 */
export const calculateMarginWithDemote = (averageCost, demoteValue, salePrice) => {
  const newCost = averageCost - demoteValue;
  return calculateMarginUnit(newCost, salePrice);
};

/**
 * Calcula valor total de rebaixa
 * @param {number} demoteValueUnit - Valor unitário da rebaixa
 * @param {number} quantity - Quantidade
 * @returns {number} Valor total da rebaixa
 */
export const calculateTotalDemoteValue = (demoteValueUnit, quantity) => {
  return (demoteValueUnit || 0) * (quantity || 0);
};

/**
 * Calcula custo com rebaixa
 * @param {number} averageCost - Custo médio
 * @param {number} demoteValue - Valor da rebaixa
 * @returns {number} Novo custo
 */
export const calculateCostWithDemote = (averageCost, demoteValue) => {
  return (averageCost || 0) - (demoteValue || 0);
};

/**
 * Calcula saldo de movimentação
 * @param {Array} movements - Array de movimentações
 * @returns {number} Saldo total
 */
export const calculateMovementBalance = (movements) => {
  if (!Array.isArray(movements)) return 0;
  
  return movements.reduce((total, movement) => {
    const value = Number(movement.movementValue) || 0;
    
    if (movement.movementTypeId === 1) {
      // Crédito
      return total + value;
    } else if (movement.movementTypeId === 2) {
      // Débito
      return total - value;
    }
    
    return total;
  }, 0);
};

/**
 * Calcula totais de uma lista de itens
 * @param {Array} items - Lista de itens
 * @param {Object} config - Configuração dos campos
 * @returns {Object} Objeto com totais calculados
 */
export const calculateTotals = (items, config = {}) => {
  if (!Array.isArray(items)) {
    return {
      quantity: 0,
      salePrice: 0,
      costPrice: 0,
      demoteCostValue: 0,
      newDemoteValue: 0,
      margin: 0
    };
  }

  const totals = items.reduce((acc, item) => {
    return {
      quantity: acc.quantity + (Number(item.quantitySold) || 0),
      salePrice: acc.salePrice + (Number(item.salePrice) || 0),
      costPrice: acc.costPrice + (Number(item.averageCostPriceProduct) || 0),
      demoteCostValue: acc.demoteCostValue + (Number(item.demotesCostValue) || 0),
      newDemoteValue: acc.newDemoteValue + (Number(item.newDemotesValue) || 0)
    };
  }, {
    quantity: 0,
    salePrice: 0,
    costPrice: 0,
    demoteCostValue: 0,
    newDemoteValue: 0
  });

  // Calcula margem final
  const salePrice = totals.salePrice;
  const costPrice = totals.costPrice - totals.newDemoteValue;
  
  totals.margin = salePrice > 0 ? ((costPrice / salePrice - 1) * -1 * 100) : 0;

  return totals;
};

/**
 * Calcula diferença entre valores
 * @param {number} newValue - Novo valor
 * @param {number} oldValue - Valor antigo
 * @returns {number} Diferença
 */
export const calculateDifference = (newValue, oldValue) => {
  return (newValue || 0) - (oldValue || 0);
};

/**
 * Calcula percentual de variação
 * @param {number} newValue - Novo valor
 * @param {number} oldValue - Valor antigo
 * @returns {number} Percentual de variação
 */
export const calculateVariationPercent = (newValue, oldValue) => {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Valida se um valor numérico é válido
 * @param {any} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export const isValidNumber = (value) => {
  return value !== null && value !== undefined && !isNaN(Number(value)) && isFinite(Number(value));
};

/**
 * Garante que um valor seja um número válido
 * @param {any} value - Valor a ser normalizado
 * @param {number} defaultValue - Valor padrão se inválido
 * @returns {number} Número válido
 */
export const ensureNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isValidNumber(num) ? num : defaultValue;
};

/**
 * Calcula média ponderada
 * @param {Array} items - Lista de itens com valor e peso
 * @param {string} valueField - Campo do valor
 * @param {string} weightField - Campo do peso
 * @returns {number} Média ponderada
 */
export const calculateWeightedAverage = (items, valueField, weightField) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  
  const total = items.reduce((acc, item) => {
    const value = Number(item[valueField]) || 0;
    const weight = Number(item[weightField]) || 0;
    return {
      sum: acc.sum + (value * weight),
      totalWeight: acc.totalWeight + weight
    };
  }, { sum: 0, totalWeight: 0 });
  
  return total.totalWeight > 0 ? total.sum / total.totalWeight : 0;
};
