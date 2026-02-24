import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatPercent,
  formatPercentFixed,
  formatDateBR,
  formatDateTimeBR,
  formatDateForInput,
  formatNumber,
  formatCurrencySafe,
} from '../formatters'

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$\xa00,00')
  })

  it('formats positive integer', () => {
    expect(formatCurrency(1500)).toBe('R$\xa01.500,00')
  })

  it('formats decimal value', () => {
    expect(formatCurrency(9.99)).toBe('R$\xa09,99')
  })

  it('formats null as R$ 0,00', () => {
    expect(formatCurrency(null)).toBe('R$\xa00,00')
  })

  it('formats string number', () => {
    expect(formatCurrency('250.50')).toBe('R$\xa0250,50')
  })
})

describe('formatPercent', () => {
  it('formats 50 as 50%', () => {
    expect(formatPercent(50)).toContain('50')
    expect(formatPercent(50)).toContain('%')
  })

  it('formats 0 as 0%', () => {
    expect(formatPercent(0)).toContain('0')
    expect(formatPercent(0)).toContain('%')
  })

  it('handles null as 0%', () => {
    expect(formatPercent(null)).toContain('0')
  })
})

describe('formatPercentFixed', () => {
  it('formats 12.5 as "12,50%"', () => {
    expect(formatPercentFixed(12.5)).toBe('12,50%')
  })

  it('returns "0,00%" for null', () => {
    expect(formatPercentFixed(null)).toBe('0,00%')
  })

  it('returns "0,00%" for undefined', () => {
    expect(formatPercentFixed(undefined)).toBe('0,00%')
  })

  it('returns "0,00%" for Infinity', () => {
    expect(formatPercentFixed(Infinity)).toBe('0,00%')
  })

  it('formats 100 as "100,00%"', () => {
    expect(formatPercentFixed(100)).toBe('100,00%')
  })
})

describe('formatDateBR', () => {
  it('returns "-" for null', () => {
    expect(formatDateBR(null)).toBe('-')
  })

  it('returns "-" for empty string', () => {
    expect(formatDateBR('')).toBe('-')
  })

  it('returns "-" for invalid date', () => {
    expect(formatDateBR('not-a-date')).toBe('-')
  })

  it('formats ISO date to pt-BR', () => {
    // Use a fixed UTC date to avoid timezone shifts
    const result = formatDateBR('2024-06-15T12:00:00Z')
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })
})

describe('formatDateForInput', () => {
  it('returns empty string for null', () => {
    expect(formatDateForInput(null)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(formatDateForInput('')).toBe('')
  })

  it('returns yyyy-MM-dd format', () => {
    const result = formatDateForInput('2024-03-20T00:00:00Z')
    expect(result).toBe('2024-03-20')
  })
})

describe('formatNumber', () => {
  it('formats 1000 with thousand separator', () => {
    expect(formatNumber(1000)).toBe('1.000')
  })

  it('formats 0', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles null as 0', () => {
    expect(formatNumber(null)).toBe('0')
  })
})

describe('formatCurrencySafe', () => {
  it('formats valid number', () => {
    expect(formatCurrencySafe(100)).toBe('R$\xa0100,00')
  })

  it('returns "R$ 0,00" for Infinity', () => {
    expect(formatCurrencySafe(Infinity)).toBe('R$ 0,00')
  })

  it('returns "R$ 0,00" for NaN', () => {
    expect(formatCurrencySafe(NaN)).toBe('R$ 0,00')
  })
})
