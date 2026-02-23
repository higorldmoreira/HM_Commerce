using System.Collections.Generic;
using System.Linq;

namespace Domain.Models.ERP.Commercial
{
    public class CompactDemotes
    {
        /// <summary>Identificador da Filial</summary>
        public int branchId { get; set; }

        /// <summary>Nome da Filial</summary>
        public string branchName { get; set; }

        /// <summary>Nome Fantasia da Filial</summary>
        public string branchNickName { get; set; }

        /// <summary>Identificador do Fornecedor</summary>
        public int supplierId { get; set; }

        /// <summary>Nome do Fornecedor</summary>
        public string supplierName { get; set; }

        /// <summary>Nome Fantasia do Fornecedor</summary>
        public string supplierNickName { get; set; }

        /// <summary>Identificador do Produto</summary>
        public int productId { get; set; }

        /// <summary>Nome do Produto</summary>
        public string productName { get; set; }

        /// <summary>Quantidade Vendida</summary>
        //public decimal quantitySold { get; set; }

        /// <summary>Preço de Venda</summary>
        //public decimal salePrice { get; set; }

        /// <summary>Preço Unitário de Venda</summary>
        //public decimal salePriceUnit { get; set; }

        /// <summary>Preço de Custo do Produto</summary>
        //public decimal productCostPrice { get; set; }

        /// <summary>Preço Unitário de Custo do Produto</summary>
        //public decimal productCostPriceUnit { get; set; }

        /// <summary>Preço Médio de Custo do Produto</summary>
        //public decimal averageCostPriceProduct { get; set; }

        /// <summary>Preço Unitário Médio de Custo do Produto</summary>
        //public decimal averageCostPriceProductUnit { get; set; }

        /// <summary>Valor de Rebaixa</summary>
        //public decimal demotesValue { get; set; }

        /// <summary>Valor de diferença de Rebaixa</summary>
        public decimal demotesDifferenceValue { get; set; }

        /// <summary>Valor Unitário de Rebaixa</summary>
        //public decimal demotesValueUnit { get; set; }

        /// <summary>Valor Unitário de diferença de Rebaixa</summary>
        //public decimal demotesDifferenceValueUnit { get; set; }

        /// <summary>Valor de Custo com Rebaixa</summary>
        //public decimal demotesCostValue { get; set; }

        /// <summary>Valor Unitário de Custo com Rebaixa</summary>
       // public decimal demotesCostValueUnit { get; set; }

        public List<InvoiceItemDemotes> Items { get; set; }

        public static List<CompactDemotes> Agrupar(List<InvoiceItemDemotes> invoiceItems)
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
                    x.productId,
                    x.productName,
                    //x.salePriceUnit,
                    //x.productCostPriceUnit,
                    //x.averageCostPriceProductUnit,
                    //x.demotesValueUnit,
                    //x.demotesCostValueUnit,
                    //x.demotesDifferenceValueUnit

                })
                .Select(g => new CompactDemotes
                {
                    branchId = g.Key.branchId,
                    branchName = g.Key.branchName,
                    branchNickName = g.Key.branchNickName,
                    supplierId = g.Key.supplierId,
                    supplierName = g.Key.supplierName,
                    supplierNickName = g.Key.supplierNickName,
                    productId = g.Key.productId,
                    productName = g.Key.productName,
                    //salePriceUnit = g.Key.salePriceUnit,
                    //productCostPriceUnit = g.Key.productCostPriceUnit,
                    //averageCostPriceProductUnit = g.Key.averageCostPriceProductUnit,
                    //demotesValueUnit = g.Key.demotesValueUnit,
                    //demotesCostValueUnit = g.Key.demotesCostValueUnit,
                   // demotesDifferenceValueUnit = g.Key.demotesDifferenceValueUnit,

                    //quantitySold = g.Sum(x => x.quantitySold),
                    //salePrice = g.Sum(x => x.salePrice),
                    //productCostPrice = g.Sum(x => x.productCostPrice),
                    //averageCostPriceProduct = g.Sum(x => x.averageCostPriceProduct),
                    //demotesValue = g.Sum(x => x.demotesValue),
                    demotesDifferenceValue = g.Sum(x => x.demotesDifferenceValue),
                    //demotesCostValue = g.Sum(x => x.demotesCostValue),

                    Items = g.ToList()
                })
                .ToList();

            return agrupado;
        }

    }
}
