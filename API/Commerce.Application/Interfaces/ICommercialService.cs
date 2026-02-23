using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Models.Validation;

namespace Commerce.Application.Interfaces
{
    /// <summary>
    /// Contrato para operações comerciais: movimentações de fornecedor,
    /// rebaixas, condições de rebaixa e itens de condição.
    /// </summary>
    public interface ICommercialService
    {
        // --- Supplier Movement ---

        Task<List<SupplierMovement>> GetSupplierMovementsAsync(SupplierMovementParameters parameters);

        Task<List<ValidationResult>> PostSupplierMovementAsync(List<SupplierMovement> supplierMovements);

        // --- Demotes (Invoice item rebaixas) ---

        Task<List<Demotes>> GetDemotesAsync(DemotesParameters parameters);

        Task<List<ValidationResult>> PutInvoiceItemDemotesAsync(List<InvoiceItemDemotes> invoiceItemDemotes);

        // --- Condition Demotes ---

        Task<List<ConditionDemote>> GetConditionDemotesAsync(ConditionDemoteParameters parameters);

        Task<ValidationResult> PostConditionDemoteAsync(ConditionDemote conditionDemote);

        // --- Condition Item Demotes ---

        Task<List<ConditionItemDemote>> GetConditionItemDemotesAsync(ConditionItemDemoteParameters parameters);

        Task<ValidationResult> PostConditionItemDemoteAsync(ConditionItemDemote conditionItemDemote);
    }
}
