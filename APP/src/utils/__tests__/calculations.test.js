import { describe, it, expect } from 'vitest'
import {
  calculateMarginUnit,
  calculateMarginWithDemote,
  calculateTotalDemoteValue,
  calculateCostWithDemote,
  calculateMovementBalance,
  calculateDifference,
  calculateVariationPercent,
  isValidNumber,
  ensureNumber,
  calculateWeightedAverage,
  calculateTotals,
} from '../calculations'

describe('calculateMarginUnit', () => {
  it('calculates margin correctly', () => {
    // cost=80, salePrice=100 → margin = (80/100 - 1) * -1 * 100 = 20
    expect(calculateMarginUnit(80, 100)).toBeCloseTo(20)
  })

  it('returns 0 when salePrice is 0', () => {
    expect(calculateMarginUnit(80, 0)).toBe(0)
  })

  it('returns 0 when salePrice is null/undefined', () => {
    expect(calculateMarginUnit(80, null)).toBe(0)
    expect(calculateMarginUnit(80, undefined)).toBe(0)
  })

  it('returns negative margin when cost exceeds price', () => {
    expect(calculateMarginUnit(120, 100)).toBeCloseTo(-20)
  })
})

describe('calculateMarginWithDemote', () => {
  it('reduces cost by demote value before calculating margin', () => {
    // cost=80, demote=10 → newCost=70, salePrice=100 → margin=30
    expect(calculateMarginWithDemote(80, 10, 100)).toBeCloseTo(30)
  })

  it('returns 0 when salePrice is 0', () => {
    expect(calculateMarginWithDemote(80, 10, 0)).toBe(0)
  })
})

describe('calculateTotalDemoteValue', () => {
  it('multiplies unit value by quantity', () => {
    expect(calculateTotalDemoteValue(5, 3)).toBe(15)
  })

  it('returns 0 for null inputs', () => {
    expect(calculateTotalDemoteValue(null, 3)).toBe(0)
    expect(calculateTotalDemoteValue(5, null)).toBe(0)
    expect(calculateTotalDemoteValue(null, null)).toBe(0)
  })
})

describe('calculateCostWithDemote', () => {
  it('subtracts demote from average cost', () => {
    expect(calculateCostWithDemote(100, 20)).toBe(80)
  })

  it('handles null values as 0', () => {
    expect(calculateCostWithDemote(null, 20)).toBe(-20)
    expect(calculateCostWithDemote(100, null)).toBe(100)
  })
})

describe('calculateMovementBalance', () => {
  it('sums credits (typeId=1) and subtracts debits (typeId=2)', () => {
    const movements = [
      { movementValue: 100, movementTypeId: 1 },
      { movementValue: 30,  movementTypeId: 2 },
      { movementValue: 50,  movementTypeId: 1 },
    ]
    expect(calculateMovementBalance(movements)).toBe(120)
  })

  it('returns 0 for empty array', () => {
    expect(calculateMovementBalance([])).toBe(0)
  })

  it('returns 0 for non-array', () => {
    expect(calculateMovementBalance(null)).toBe(0)
    expect(calculateMovementBalance(undefined)).toBe(0)
  })
})

describe('calculateDifference', () => {
  it('returns new - old', () => {
    expect(calculateDifference(150, 100)).toBe(50)
  })

  it('returns negative when new < old', () => {
    expect(calculateDifference(80, 100)).toBe(-20)
  })

  it('handles null as 0', () => {
    expect(calculateDifference(null, 100)).toBe(-100)
    expect(calculateDifference(100, null)).toBe(100)
  })
})

describe('calculateVariationPercent', () => {
  it('calculates 20% increase correctly', () => {
    expect(calculateVariationPercent(120, 100)).toBeCloseTo(20)
  })

  it('returns 0 when oldValue is 0/null', () => {
    expect(calculateVariationPercent(100, 0)).toBe(0)
    expect(calculateVariationPercent(100, null)).toBe(0)
  })
})

describe('isValidNumber', () => {
  it('returns true for valid numbers', () => {
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(42)).toBe(true)
    expect(isValidNumber(-3.5)).toBe(true)
    expect(isValidNumber('99')).toBe(true)
  })

  it('returns false for null/undefined/NaN/Infinity', () => {
    expect(isValidNumber(null)).toBe(false)
    expect(isValidNumber(undefined)).toBe(false)
    expect(isValidNumber(NaN)).toBe(false)
    expect(isValidNumber(Infinity)).toBe(false)
  })
})

describe('ensureNumber', () => {
  it('returns the number if valid', () => {
    expect(ensureNumber(42)).toBe(42)
    expect(ensureNumber('3.14')).toBeCloseTo(3.14)
  })

  it('returns default when invalid', () => {
    expect(ensureNumber(null)).toBe(0)
    expect(ensureNumber(undefined, 99)).toBe(99)
    expect(ensureNumber('abc', -1)).toBe(-1)
  })
})

describe('calculateWeightedAverage', () => {
  it('calculates weighted average correctly', () => {
    const items = [
      { price: 10, qty: 2 },
      { price: 20, qty: 3 },
    ]
    // (10*2 + 20*3) / (2+3) = 80/5 = 16
    expect(calculateWeightedAverage(items, 'price', 'qty')).toBeCloseTo(16)
  })

  it('returns 0 for empty array', () => {
    expect(calculateWeightedAverage([], 'price', 'qty')).toBe(0)
  })

  it('returns 0 when total weight is 0', () => {
    const items = [{ price: 10, qty: 0 }]
    expect(calculateWeightedAverage(items, 'price', 'qty')).toBe(0)
  })
})

describe('calculateTotals', () => {
  it('returns zero totals for empty array', () => {
    const result = calculateTotals([])
    expect(result.quantity).toBe(0)
    expect(result.salePrice).toBe(0)
  })

  it('returns zero totals for non-array input', () => {
    const result = calculateTotals(null)
    expect(result.quantity).toBe(0)
  })

  it('sums quantities and prices correctly', () => {
    const items = [
      { quantitySold: 10, salePrice: 100, averageCostPriceProduct: 80, demotesCostValue: 0, newDemotesValue: 5 },
      { quantitySold: 5,  salePrice: 50,  averageCostPriceProduct: 40, demotesCostValue: 0, newDemotesValue: 2 },
    ]
    const result = calculateTotals(items)
    expect(result.quantity).toBe(15)
    expect(result.salePrice).toBe(150)
    expect(result.newDemoteValue).toBe(7)
  })
})
