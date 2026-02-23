using System;
using System.Text.Json.Serialization;

namespace Domain.Models.ERP.Commercial
{
    public class InvoiceItemDemotes
    {
        /// <summary>Id</summary>
        [JsonIgnore]
        public int id { get; set; }

        /// <summary>Identificador da Filial</summary>
        public int branchId { get; set; }

        /// <summary>Nome da Filial</summary>
        public string branchName { get; set; }

        /// <summary>Nome Fantasia da Filial</summary>
        public string branchNickName { get; set; }

        /// <summary>Identificador do Cliente</summary>
        public int clientId { get; set; }

        /// <summary>Nome do Cliente</summary>
        public string clientName { get; set; }

        /// <summary>Nome Fantasia do Cliente</summary>
        public string clientNickName { get; set; }

        /// <summary>Sigla do Estado do Cliente</summary>
        public string clientStateAcronym { get; set; }

        /// <summary>Identificador do Fornecedor</summary>
        public int supplierId { get; set; }

        /// <summary>Nome do Fornecedor</summary>
        public string supplierName { get; set; }

        /// <summary>Nome Fantasia do Fornecedor</summary>
        public string supplierNickName { get; set; }

        /// <summary>Data de Emissão da Nota Fiscal</summary>
        public DateTime invoiceIssueDate { get; set; }

        /// <summary>Identificador da Nota Fiscal</summary>
        public int invoiceId { get; set; }

        /// <summary>Número da Nota Fiscal</summary>
        public string invoiceNumber { get; set; }

        /// <summary>Série da Nota Fiscal</summary>
        public string invoiceSeries { get; set; }

        /// <summary>Identificador do Produto</summary>
        public int productId { get; set; }

        /// <summary>Nome do Produto</summary>
        public string productName { get; set; }

        /// <summary>Identificador da Condição</summary>
        public int conditionId { get; set; }

        /// <summary>Nome da Condição</summary>
        public string conditionName { get; set; }

        /// <summary>Quantidade Vendida</summary>
        public decimal quantitySold { get; set; }

        /// <summary>Preço de Venda</summary>
        public decimal salePrice { get; set; }

        /// <summary>Preço Unitário de Venda</summary>
        public decimal salePriceUnit { get; set; }

        /// <summary>Preço de Custo do Produto</summary>
        public decimal productCostPrice { get; set; }

        /// <summary>Preço Unitário de Custo do Produto</summary>
        public decimal productCostPriceUnit { get; set; }

        /// <summary>Preço Médio de Custo do Produto</summary>
        public decimal averageCostPriceProduct { get; set; }
        
        /// <summary>Preço Unitário Médio de Custo do Produto</summary>
        public decimal averageCostPriceProductUnit { get; set; }

        /// <summary>Valor de Rebaixa</summary>
        public decimal demotesValue { get; set; }

        /// <summary>Valor Unitário de Rebaixa</summary>
        public decimal demotesDifferenceValue { get; set; }

        /// <summary>Valor Unitário de Rebaixa</summary>
        public decimal demotesValueUnit { get; set; }

        /// <summary>Valor Unitário de diferença de Rebaixa</summary>
        public decimal demotesDifferenceValueUnit { get; set; }

        /// <summary>Valor de Custo com Rebaixa</summary>
        public decimal demotesCostValue { get; set; }

        /// <summary>Valor Unitário de Custo com Rebaixa</summary>
        public decimal demotesCostValueUnit { get; set; }

        /// <summary>Margem Atual</summary>
        public decimal currentMargin { get; set; }

        /// <summary>Margem Atual Unitária</summary>
        public decimal currentMarginUnit { get; set; }

        /// <summary>Nova Margem</summary>
        public decimal newMargin { get; set; }

        /// <summary>Nova Margem Unitária</summary>
        public decimal newMarginUnit { get; set; }

        /// <summary>Usuário que realizou o Cadastro no caso de gravação da Rebaixa</summary>        
        //[Required(ErrorMessage = "The typistName field is mandatory.")]
        public string typistName { get; set; }

        /// <summary>Total Balanço /SAldo Movimentação do Fornecedor</summary>
        public decimal supplierBalance { get; set; }
    }
}
