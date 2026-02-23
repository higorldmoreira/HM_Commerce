import * as XLSX from 'xlsx'

/**
 * Exporta dados para um arquivo Excel diretamente.
 *
 * @param {Array} data - Dados a serem exportados (array de objetos).
 * @param {string} fileName - Nome do arquivo a ser exportado (sem extensão).
 */
export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')

  // Salva diretamente o arquivo sem depender de blobs
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx', type: 'binary' })
}
