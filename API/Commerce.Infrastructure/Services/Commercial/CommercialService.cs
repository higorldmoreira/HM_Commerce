using System.Collections.Generic;
using System.Threading.Tasks;
using Commerce.Application.Interfaces;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Models.Validation;
using Domain.Service.Commercial.Get;
using Domain.Service.Commercial.Post;
using Domain.Service.Commercial.Put;
using Microsoft.Extensions.Configuration;

namespace Commerce.Infrastructure.Services.Commercial
{
    /// <summary>
    /// Implementação concreta de ICommercialService.
    /// Delega operações para os serviços de baixo nível do Domain,
    /// obtendo a connection string via IConfiguration injetada.
    /// </summary>
    public class CommercialService : ICommercialService
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public CommercialService(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("Commerce");
        }

        // -------------------------------------------------------
        //  Supplier Movement
        // -------------------------------------------------------

        public async Task<List<SupplierMovement>> GetSupplierMovementsAsync(SupplierMovementParameters parameters)
        {
            var service = new GetSupplierMovementService(_connectionString, _configuration);
            return await service.ExecuteAsync(parameters);
        }

        public async Task<List<ValidationResult>> PostSupplierMovementAsync(List<SupplierMovement> supplierMovements)
        {
            var service = new PostSupplierMovementService(_connectionString, _configuration);
            return await service.PostSupplierMovement(supplierMovements);
        }

        // -------------------------------------------------------
        //  Demotes
        // -------------------------------------------------------

        public async Task<List<Demotes>> GetDemotesAsync(DemotesParameters parameters)
        {
            var service = new GetDemotesService(_connectionString, _configuration);
            return await service.ExecuteWithGroupingAsync(parameters);
        }

        public async Task<List<ValidationResult>> PutInvoiceItemDemotesAsync(List<InvoiceItemDemotes> invoiceItemDemotes)
        {
            var service = new PutInvoiceItemDemotesService(_connectionString, _configuration);
            return await service.PutInvoiceItemDemotes(invoiceItemDemotes);
        }

        // -------------------------------------------------------
        //  Condition Demotes
        // -------------------------------------------------------

        public async Task<List<ConditionDemote>> GetConditionDemotesAsync(ConditionDemoteParameters parameters)
        {
            var service = new GetConditionDemotesService(_connectionString);
            return await service.ExecuteAsync(parameters);
        }

        public async Task<ValidationResult> PostConditionDemoteAsync(ConditionDemote conditionDemote)
        {
            var service = new PostConditionDemotesService(_connectionString, _configuration, conditionDemote);
            return await service.ExecuteValidatedAsync();
        }

        // -------------------------------------------------------
        //  Condition Item Demotes
        // -------------------------------------------------------

        public async Task<List<ConditionItemDemote>> GetConditionItemDemotesAsync(ConditionItemDemoteParameters parameters)
        {
            var service = new GetConditionItemDemotesService(_connectionString);
            return await service.ExecuteAsync(parameters);
        }

        public async Task<ValidationResult> PostConditionItemDemoteAsync(ConditionItemDemote conditionItemDemote)
        {
            var service = new PostConditionItemDemotesService(_connectionString, _configuration, conditionItemDemote);
            return await service.ExecuteValidatedAsync();
        }
    }
}
