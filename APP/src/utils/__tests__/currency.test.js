import { describe, it, expect } from 'vitest'
import {
  sanitizeCurrencyString,
  parseCurrencyToNumber,
  formatCurrencyInput,
} from '../currency'

describe('sanitizeCurrencyString', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeCurrencyString(null)).toBe('')
    expect(sanitizeCurrencyString(undefined)).toBe('')
    expect(sanitizeCurrencyString('')).toBe('')
  })

  it('removes R$ symbol', () => {
    expect(sanitizeCurrencyString('R$ 1.500,00')).toBe('1.500,00')
  })

  it('removes whitespace', () => {
    expect(sanitizeCurrencyString('  250,00  ')).toBe('250,00')
  })

  it('keeps digits, comma and dot', () => {
    const result = sanitizeCurrencyString('R$ 1.234,56')
    expect(result).toBe('1.234,56')
  })
})

describe('parseCurrencyToNumber', () => {
  it('returns 0 for null/undefined/empty', () => {
    expect(parseCurrencyToNumber(null)).toBe(0)
    expect(parseCurrencyToNumber(undefined)).toBe(0)
    expect(parseCurrencyToNumber('')).toBe(0)
  })

  it('returns number as-is if already a number', () => {
    expect(parseCurrencyToNumber(42.5)).toBe(42.5)
  })

  it('parses Brazilian format "1.500,00"', () => {
    expect(parseCurrencyToNumber('1.500,00')).toBe(1500)
  })

  it('parses "R$ 9,99"', () => {
    expect(parseCurrencyToNumber('R$ 9,99')).toBe(9.99)
  })

  it('parses plain decimal "123.45"', () => {
    expect(parseCurrencyToNumber('123.45')).toBe(123.45)
  })

  it('returns 0 for non-numeric string', () => {
    expect(parseCurrencyToNumber('abc')).toBe(0)
  })

  it('parses negative value "-50,00"', () => {
    // After cleaning: "-5000" → parsed as -50
    expect(parseCurrencyToNumber('-50,00')).toBe(-50)
  })
})

describe('formatCurrencyInput', () => {
  it('returns empty string for 0/null/empty', () => {
    expect(formatCurrencyInput(0)).toBe('')
    expect(formatCurrencyInput(null)).toBe('')
    expect(formatCurrencyInput('')).toBe('')
  })

  it('formats integer value in Brazilian format', () => {
    const result = formatCurrencyInput(100)
    expect(result).toMatch(/1,00/)
  })

  it('formats "15000" as "150,00"', () => {
    const result = formatCurrencyInput('15000')
    expect(result).toMatch(/150,00/)
  })
})
