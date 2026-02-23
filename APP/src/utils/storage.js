/**
 * Storage - Abstração do localStorage
 * Centraliza manipulação do localStorage com tratamento de erros
 */

/**
 * Obtém valor do localStorage com tratamento de erro
 * @param {string} key - Chave do localStorage
 * @param {any} defaultValue - Valor padrão se não encontrar
 * @returns {any} Valor do localStorage ou valor padrão
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Erro ao acessar localStorage para chave "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Define valor no localStorage com tratamento de erro
 * @param {string} key - Chave do localStorage
 * @param {any} value - Valor a ser armazenado
 * @returns {boolean} True se sucesso, false se erro
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Erro ao definir localStorage para chave "${key}":`, error);
    return false;
  }
};

/**
 * Remove item do localStorage com tratamento de erro
 * @param {string} key - Chave do localStorage
 * @returns {boolean} True se sucesso, false se erro
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erro ao remover localStorage para chave "${key}":`, error);
    return false;
  }
};

/**
 * Obtém filial selecionada do localStorage
 * @returns {string|null} ID da filial ou null
 */
export const getSelectedBranchId = () => {
  const branchId = getStorageItem('selectedBranchId');
  
  // Valida se é um ID válido (não é 'null', '(TODAS)', etc.)
  if (!branchId || branchId === 'null' || branchId === '(TODAS)' || branchId === 'undefined') {
    return null;
  }
  
  return branchId;
};

/**
 * Define filial selecionada no localStorage
 * @param {string} branchId - ID da filial
 * @returns {boolean} True se sucesso
 */
export const setSelectedBranchId = (branchId) => {
  return setStorageItem('selectedBranchId', branchId);
};

/**
 * Obtém nome do usuário do localStorage
 * @returns {string} Nome do usuário ou string vazia
 */
export const getUsername = () => {
  return getStorageItem('username', '');
};

/**
 * Define nome do usuário no localStorage
 * @param {string} username - Nome do usuário
 * @returns {boolean} True se sucesso
 */
export const setUsername = (username) => {
  return setStorageItem('username', username);
};

/**
 * Limpa todos os dados do localStorage
 * @returns {boolean} True se sucesso
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
    return false;
  }
};

/**
 * Verifica se o localStorage está disponível
 * @returns {boolean} True se disponível
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Obtém dados do localStorage como JSON
 * @param {string} key - Chave do localStorage
 * @param {any} defaultValue - Valor padrão se não encontrar
 * @returns {any} Objeto parseado ou valor padrão
 */
export const getStorageJSON = (key, defaultValue = null) => {
  try {
    const item = getStorageItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao fazer parse do JSON para chave "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Define dados no localStorage como JSON
 * @param {string} key - Chave do localStorage
 * @param {any} value - Valor a ser armazenado
 * @returns {boolean} True se sucesso
 */
export const setStorageJSON = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    return setStorageItem(key, jsonString);
  } catch (error) {
    console.error(`Erro ao serializar JSON para chave "${key}":`, error);
    return false;
  }
};

/**
 * Sincroniza filial do localStorage com estado
 * @param {Function} setBranchId - Função para definir branchId
 * @returns {Function} Função de cleanup
 */
export const syncBranchFromStorage = (setBranchId) => {
  const updateBranch = () => {
    try {
      const savedBranch = getSelectedBranchId();
      setBranchId(savedBranch || '');
    } catch (error) {
      console.error('Erro ao sincronizar branch do localStorage:', error);
    }
  };

  // Atualiza imediatamente
  updateBranch();

  // Adiciona listener para mudanças
  const handleBranchChange = () => {
    try {
      updateBranch();
    } catch (error) {
      console.error('Erro no handler de mudança de branch:', error);
    }
  };

  window.addEventListener('selectedBranchChanged', handleBranchChange);

  // Retorna função de cleanup
  return () => {
    try {
      window.removeEventListener('selectedBranchChanged', handleBranchChange);
    } catch (error) {
      console.error('Erro ao remover event listener:', error);
    }
  };
};
