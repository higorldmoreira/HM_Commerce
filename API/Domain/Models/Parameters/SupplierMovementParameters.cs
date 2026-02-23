using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Parameters
{
    public class SupplierMovementParameters
    {
        /// <summary>Id da Filial no ERP, Com o Digito Verificador</summary>
        //[Required(ErrorMessage = "The branchId field is mandatory.")]
        public int? branchId { get; set; } = null;

        /// <summary>Id do Fornecedor no ERP, Com o Digito Verificador</summary>
        [Required(ErrorMessage = "The supplierId field is mandatory.")]
        public int? supplierId { get; set; } = null;

        /// <summary>Tipo do Movimento (1 = Credito / 2 =  Débito)</summary>
        //[Required(ErrorMessage = "The entryOrExit field is mandatory.")]
        public int movementTypeId { get; set; }
    }
}