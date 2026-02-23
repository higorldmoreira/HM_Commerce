using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Models.Generic.ComboBox.Branch;
using Domain.Models.Generic.ComboBox.Condition;
using Domain.Models.Generic.ComboBox.Product;
using Domain.Models.Generic.ComboBox.Supplier;

namespace Commerce.Application.Interfaces
{
    /// <summary>
    /// Contrato para obtenção de dados de combo (selects) usados nos filtros da UI.
    /// </summary>
    public interface IComboService
    {
        Task<List<BranchInCombo>> GetBranchesAsync();

        Task<List<SupplierInCombo>> GetProductSuppliersAsync();

        Task<List<ProductInCombo>> GetProductsAsync(int? supplierId = null);

        Task<List<SalesConditionInCombo>> GetSalesConditionsAsync(int? branchId = null);
    }
}
