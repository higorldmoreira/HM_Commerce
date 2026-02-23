export const sanitizeBranchId = value => {
  if (value === null || value === undefined) {
    return null
  }

  const stringValue = String(value).trim()

  if (!stringValue || stringValue === 'null' || stringValue === '(TODAS)') {
    return null
  }

  return stringValue
}
