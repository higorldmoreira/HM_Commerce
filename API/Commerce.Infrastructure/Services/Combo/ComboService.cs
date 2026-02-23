using System.Collections.Generic;
using System.Threading.Tasks;
using Commerce.Application.Interfaces;
using Domain.Models.Generic.ComboBox.Branch;
using Domain.Models.Generic.ComboBox.Condition;
using Domain.Models.Generic.ComboBox.Product;
using Domain.Models.Generic.ComboBox.Supplier;
using Domain.Service.Generic.ComboBox;
using Microsoft.Extensions.Configuration;

namespace Commerce.Infrastructure.Services.Combo
{
    /// <summary>
    /// Implementação concreta de IComboService.
    /// Fornece dados de combos (selects) para a camada de apresentação.
    /// </summary>
    public class ComboService : IComboService
    {
        private readonly string _connectionString;

        public ComboService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Commerce");
        }

        public async Task<List<BranchInCombo>> GetBranchesAsync()
        {
            var service = new GetBranchInComboService(_connectionString);
            return await service.ExecuteAsync();
        }

        public async Task<List<SupplierInCombo>> GetProductSuppliersAsync()
        {
            var service = new GetSupplierInComboService(_connectionString);
            return await service.ExecuteAsync();
        }

        public async Task<List<ProductInCombo>> GetProductsAsync(int? supplierId = null)
        {
            var service = new GetProductInComboService(_connectionString, supplierId);
            return await service.ExecuteAsync();
        }

        public async Task<List<SalesConditionInCombo>> GetSalesConditionsAsync(int? branchId = null)
        {
            var service = new GetSalesConditionInComboService(_connectionString, branchId);
            return await service.ExecuteAsync();
        }
    }
}
