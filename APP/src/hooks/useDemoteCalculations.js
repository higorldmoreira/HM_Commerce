import { useState, useCallback, useMemo } from 'react';
import { 
  calculateMarginUnit, 
  calculateCostWithDemote, 
  calculateTotalDemoteValue,
  calculateTotals 
} from '../utils/calculations';
import { parseCurrencyToNumber } from '../utils/currency';

/**
 * useDemoteCalculations - Hook para cálculos de rebaixa
 * @param {Object} options - Opções do hook
 * @param {Array} options.demotes - Lista de produtos com rebaixa
 * @param {Function} options.onDemotesChange - Callback para mudança de demotes
 * @returns {Object} Estado e funções de cálculo
 */
export const useDemoteCalculations = ({
  demotes = [],
  onDemotesChange
} = {}) => {
  const [demotesAllValue, setDemotesAllValue] = useState(0);

  const updateDemoteValue = useCallback((salePriceUnitKey, value) => {
    const valorNumerico = parseCurrencyToNumber(value);

    const novosDados = demotes.map(item => {
      if (item.salePriceUnit !== salePriceUnitKey) return item;

      const demotesCostValueUnit = calculateCostWithDemote(
        item.averageCostPriceProductUnit,
        valorNumerico
      );
      const newMarginUnit = calculateMarginUnit(
        demotesCostValueUnit,
        item.salePriceUnit
      );

      return {
        ...item,
        demotesValueUnit: valorNumerico,
        newDemotesValue: calculateTotalDemoteValue(valorNumerico, item.quantitySold),
        demotesCostValueUnit,
        demotesCostValue: demotesCostValueUnit * item.quantitySold,
        newMarginUnit,
        items: (item.items ?? []).map(invoice => {
          const invoiceCost = calculateCostWithDemote(
            invoice.averageCostPriceProductUnit,
            valorNumerico
          );
          const invoiceMargin = calculateMarginUnit(
            invoiceCost,
            invoice.salePriceUnit
          );

          return {
            ...invoice,
            demotesValueUnit: valorNumerico,
            newDemotesValue: calculateTotalDemoteValue(valorNumerico, invoice.quantitySold),
            demotesCostValueUnit: invoiceCost,
            demotesCostValue: invoiceCost * invoice.quantitySold,
            newMarginUnit: invoiceMargin
          };
        })
      };
    });

    onDemotesChange?.(novosDados);
  }, [demotes, onDemotesChange]);

  const updateAllDemoteValues = useCallback((value) => {
    const valorNumerico = parseCurrencyToNumber(value);
    setDemotesAllValue(valorNumerico);

    const novosDados = demotes.map(item => {
      const demotesCostValueUnit = calculateCostWithDemote(
        item.averageCostPriceProductUnit,
        valorNumerico
      );
      const newMarginUnit = calculateMarginUnit(
        demotesCostValueUnit,
        item.salePriceUnit
      );

      return {
        ...item,
        demotesValueUnit: valorNumerico,
        newDemotesValue: calculateTotalDemoteValue(valorNumerico, item.quantitySold),
        demotesCostValueUnit,
        demotesCostValue: demotesCostValueUnit * item.quantitySold,
        newMarginUnit,
        items: (item.items ?? []).map(invoice => {
          const invoiceCost = calculateCostWithDemote(
            invoice.averageCostPriceProductUnit,
            valorNumerico
          );
          const invoiceMargin = calculateMarginUnit(
            invoiceCost,
            invoice.salePriceUnit
          );

          return {
            ...invoice,
            demotesValueUnit: valorNumerico,
            newDemotesValue: calculateTotalDemoteValue(valorNumerico, invoice.quantitySold),
            demotesCostValueUnit: invoiceCost,
            demotesCostValue: invoiceCost * invoice.quantitySold,
            newMarginUnit: invoiceMargin
          };
        })
      };
    });

    onDemotesChange?.(novosDados);
  }, [demotes, onDemotesChange]);

  const totals = useMemo(() => {
    return calculateTotals(demotes);
  }, [demotes]);

  const calculatedMargin = useMemo(() => {
    const { salePrice, costPrice, newDemoteValue } = totals;
    if (!salePrice || salePrice === 0) return 0;
    return ((costPrice - newDemoteValue) / salePrice - 1) * -1 * 100;
  }, [totals]);

  return {
    // Estado
    demotesAllValue,
    totals,
    calculatedMargin,
    
    // Funções
    updateDemoteValue,
    updateAllDemoteValues,
    setDemotesAllValue
  };
};
