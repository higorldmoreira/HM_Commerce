using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Domain.Models.ERP.Commercial
{
    public class SupplierMovement
    {
        /// <summary>ID do Fornecedor no ERP</summary>
        [JsonIgnore]
        public Int64 id { get; set; }

        /// <summary>Código da Filial - </summary>        
        [Required(ErrorMessage = "The branchId field is mandatory.")]
        public int? branchId { get; set; }

        /// <summary>Razão Social da Filial</summary>        
        public string branchName { get; set; }

        /// <summary>Nome Fantasia da Filial</summary>        
        public string branchNickName { get; set; }

        /// <summary>Código do Fornecedor </summary>        
        [Required(ErrorMessage = "The supplierId field is mandatory.")]
        public int? supplierId { get; set; }

        /// <summary>Razão Social do Fornecedor</summary>        
        public string supplierName { get; set; }

        /// <summary>Nome Fantasia do Fornecedor</summary>        
        public string supplierNickName { get; set; }

        /// <summary>Id do Tipo do Movimento (1 = Credito / 2 =  Débito)</summary>        
        [Required(ErrorMessage = "The movementTypeId field is mandatory.")]
        public Int16 movementTypeId { get; set; }

        /// <summary>Tipo do Movimento (1 = Credito / 2 =  Débito)</summary>        
        public string movementTypeName { get; set; }

        /// <summary>Valor da movimentação</summary>        
        [Required(ErrorMessage = "The movementValue field is mandatory.")]
        [Range(1, double.MaxValue, ErrorMessage = "movementValue must be greater than 0.")]
        public decimal movementValue { get; set; }

        /// <summary>Data da movimentação(credito debito)</summary>        
        [Required(ErrorMessage = "The depositDate field is mandatory.")]
        public DateTime depositDate { get; set; }

        /// <summary>Data do cadastro da movimentação no sistema</summary>        
        [Required(ErrorMessage = "The registrationDate field is mandatory.")]
        public DateTime registrationDate { get; set; } 

        /// <summary>Usuário que realizou o Cadastro</summary>        
        [Required(ErrorMessage = "The typistName field is mandatory.")]
        public string typistName { get; set; }

        /// <summary>Observação da movimentação</summary>                
        public string observation { get; set; }

        /// <summary>Data de atualização do dado</summary>        
        [JsonIgnore]
        public DateTime lastUpdated { get; set; }

        public List<InvoiceItemDemotes> Items { get; set; }

        public static List<SupplierMovement> Agrupar(List<InvoiceItemDemotes> invoiceItems)
        {
            var agrupado = invoiceItems
                .GroupBy(x => new
                {
                    x.branchId,
                    x.branchName,
                    x.branchNickName,
                    x.supplierId,
                    x.supplierName,
                    x.supplierNickName,
                    x.typistName

                })
                .Select(g => new SupplierMovement
                {
                    branchId = g.Key.branchId,
                    branchName = g.Key.branchName,
                    branchNickName = g.Key.branchNickName,
                    supplierId = g.Key.supplierId,
                    supplierName = g.Key.supplierName,
                    supplierNickName = g.Key.supplierNickName,
                    typistName = string.IsNullOrWhiteSpace(g.Key.typistName) ? "Integrator" : g.Key.typistName,
                    movementTypeId = (short)(g.Sum(x => x.demotesDifferenceValue) > 0 ? 2 : 1),
                    movementValue = Math.Abs(g.Sum(x => x.demotesDifferenceValue)),
                    depositDate = DateTime.UtcNow,
                    registrationDate = DateTime.UtcNow,
                    observation = "Gravação de rebaixa",

                    Items = g.ToList()
                })
                .ToList();

            return agrupado;
        }
    }
}
