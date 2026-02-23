using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models.Parameters
{
    public class DemotesParameters
    {
        /// <summary>Identificador da Filial</summary>
        //[Required(ErrorMessage = "The branchId field is mandatory.")]
        public int? branchId { get; set; }

        /// <summary>Data de Início</summary>
        [Required(ErrorMessage = "The beginDate field is mandatory.")]
        public DateTime beginDate { get; set; }

        /// <summary>Data de Fim</summary>
        [Required(ErrorMessage = "The endDate field is mandatory.")]
        public DateTime endDate { get; set; }

        /// <summary>Identificador da Condição(Caso seja enviadso mais de uma, separar por virgula)</summary>
        [Required(ErrorMessage = "The conditionId field is mandatory.")]
        public string? conditionId { get; set; }

        /// <summary>Sigla do Estado</summary>
        public string? stateAcronym { get; set; }

        /// <summary>Identificador do Fornecedor</summary>
        [Required(ErrorMessage = "The supplierId field is mandatory.")]
        public int supplierId { get; set; }

        /// <summary>Identificador do Produto</summary>
        public int? productId { get; set; }

        /// <summary>Preço da Nota Fiscal ou Mercadoria (1 = Nota Fiscal / 2 =  Mercadoria)</summary>
        //[Required(ErrorMessage = "The priceInvoiceOrCommodity field is mandatory.")]
        //public short priceInvoiceOrCommodity { get; set; }
    }
}
