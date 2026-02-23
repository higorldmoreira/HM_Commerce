import React, { useRef, useCallback } from 'react';
import { TextField } from '@mui/material';
import { parseCurrencyToNumber, formatCurrencyInput, sanitizeRawCurrency } from '../../../utils/currency';

/**
 * CurrencyInput - Input de moeda formatado
 * @param {Object} props - Props do componente
 * @param {string|number} props.value - Valor atual
 * @param {Function} props.onChange - Callback para mudança de valor
 * @param {string} props.label - Label do input
 * @param {boolean} props.disabled - Se o input está desabilitado
 * @param {Object} props.sx - Estilos customizados
 * @param {Object} props.inputProps - Props do input
 */
export const CurrencyInput = ({
  value,
  onChange,
  label = 'Valor',
  disabled = false,
  sx = {},
  inputProps = {},
  ...props
}) => {
  const inputRef = useRef(null);

  const setCursorToEnd = useCallback(() => {
    const input = inputRef.current;
    if (input && typeof input.setSelectionRange === 'function') {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, []);

  const handleValueChange = useCallback((nextValue) => {
    const sanitized = sanitizeRawCurrency(nextValue);
    onChange?.(sanitized);
    
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(setCursorToEnd);
    }
  }, [onChange, setCursorToEnd]);

  const handleDigitInsertion = useCallback((digit) => {
    const [integerPart = '', decimalsPart = ''] = (value || '').split(',');
    
    if (value && value.includes(',')) {
      if (decimalsPart.length >= 2) {
        return;
      }
      handleValueChange(`${integerPart},${decimalsPart}${digit}`);
      return;
    }
    
    const nextInteger = `${integerPart}${digit}`.replace(/^0+(?=\d)/, '');
    handleValueChange(nextInteger);
  }, [value, handleValueChange]);

  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, altKey } = event;

    if (ctrlKey || metaKey || altKey) {
      return;
    }

    if (
      key === 'Tab' ||
      key === 'Shift' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'Enter' ||
      key === 'Escape'
    ) {
      return;
    }

    if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault();
      if (!value) {
        handleValueChange('');
        return;
      }
      handleValueChange(value.slice(0, -1));
      return;
    }

    if (key === ',' || key === '.') {
      event.preventDefault();
      if (!value.includes(',')) {
        const base = value === '' ? '0,' : `${value},`;
        handleValueChange(base);
      }
      return;
    }

    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      handleDigitInsertion(key);
      return;
    }

    event.preventDefault();
  }, [value, handleValueChange, handleDigitInsertion]);

  const handleBlur = useCallback(() => {
    if (!value) {
      return;
    }
    const numeric = parseCurrencyToNumber(value);
    const normalized = numeric.toFixed(2).replace('.', ',');
    handleValueChange(normalized);
  }, [value, handleValueChange]);

  const handlePaste = useCallback((event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text') ?? '';
    handleValueChange(pasted);
  }, [handleValueChange]);

  const handleFocus = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(setCursorToEnd);
    }
  }, [setCursorToEnd]);

  const formattedValue = value ? formatCurrencyInput(value) : '';

  return (
    <TextField
      label={label}
      value={formattedValue}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPaste={handlePaste}
      onFocus={handleFocus}
      fullWidth
      disabled={disabled}
      inputRef={inputRef}
      inputProps={{
        inputMode: 'decimal',
        ...inputProps
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 6,
          backgroundColor: '#FFF',
          fontSize: '13px',
          '& fieldset': { borderColor: '#E0E0E0' },
          '&:hover fieldset': { borderColor: '#1976d2' },
          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
            borderWidth: 2
          }
        },
        ...sx
      }}
      {...props}
    />
  );
};
