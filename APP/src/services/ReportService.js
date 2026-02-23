import { getApiInstance } from './api';

export const ReportService = {
  /**
   * Busca relatório de gestão de preço
   * @param {Object} params - Parâmetros da requisição
   * @param {string} params.beginDate - Data inicial (YYYY-MM-DD)
   * @param {string} params.endDate - Data final (YYYY-MM-DD)
   * @returns {Promise} Dados do relatório
   */
  async getGestaoPreco({ beginDate, endDate }) {
    try {
      const api = getApiInstance();
      const response = await api.post('/reports/gestao-preco', {
        beginDate,
        endDate
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de gestão de preço:', error);
      throw error;
    }
  }
};
