using System;
using System.Collections.Generic;

namespace Api.Models.Reports
{
    /// <summary>
    /// Requisição para o relatório de Gestão de Preço
    /// </summary>
    public class PriceManagementReportRequest
    {
        /// <summary>Data inicial do período</summary>
        public DateTime BeginDate { get; set; }
        
        /// <summary>Data final do período</summary>
        public DateTime EndDate { get; set; }
    }

    /// <summary>
    /// Item do relatório de Gestão de Preço (resultado da stpInvoiceItemResumo)
    /// </summary>
    public class PriceManagementReportItem
    {
        /// <summary>ID da filial</summary>
        public long BranchId { get; set; }
        
        /// <summary>Nome fantasia da filial</summary>
        public string BranchNickName { get; set; }
        
        /// <summary>Data de emissão da nota fiscal</summary>
        public DateTime InvoiceIssueDate { get; set; }
        
        /// <summary>Condição de pagamento (pode ser código ou descrição)</summary>
        public string Condition { get; set; }
        
        /// <summary>ID do supervisor</summary>
        public long? SupervisorId { get; set; }
        
        /// <summary>Nome do supervisor</summary>
        public string SupervisorNickName { get; set; }
        
        /// <summary>ID do vendedor</summary>
        public long SellerId { get; set; }
        
        /// <summary>Nome do vendedor</summary>
        public string SellerNickName { get; set; }
        
        /// <summary>Sigla do estado do cliente</summary>
        public string ClientStateAcronym { get; set; }
        
        /// <summary>Quantidade vendida</summary>
        public decimal Quantity { get; set; }
        
        /// <summary>Preço de venda unitário</summary>
        public decimal SalePriceUnit { get; set; }
        
        /// <summary>Preço de custo total do produto</summary>
        public decimal ProductCostPrice { get; set; }
        
        /// <summary>Preço de custo unitário do produto</summary>
        public decimal ProductCostPriceUnit { get; set; }
        
        /// <summary>Custo médio total do produto</summary>
        public decimal AverageCostPriceProduct { get; set; }
        
        /// <summary>Custo médio unitário do produto</summary>
        public decimal AverageCostPriceProductUnit { get; set; }
        
        /// <summary>Valor total de rebaixa</summary>
        public decimal DemotesValue { get; set; }
        
        /// <summary>Valor unitário de rebaixa</summary>
        public decimal DemotesValueUnit { get; set; }
        
        /// <summary>Valor total de custo com rebaixa</summary>
        public decimal DemotesCostValue { get; set; }
        
        /// <summary>Valor unitário de custo com rebaixa</summary>
        public decimal DemotesCostValueUnit { get; set; }
        
        /// <summary>Margem atual (sem rebaixa) %</summary>
        public decimal CurrentMargin { get; set; }
        
        /// <summary>Margem atual unitária (sem rebaixa) %</summary>
        public decimal CurrentMarginUnit { get; set; }
        
        /// <summary>Nova margem (com rebaixa) %</summary>
        public decimal NewMargin { get; set; }
        
        /// <summary>Nova margem unitária (com rebaixa) %</summary>
        public decimal NewMarginUnit { get; set; }
    }

    /// <summary>
    /// Resposta do relatório de Gestão de Preço
    /// </summary>
    public class PriceManagementReportResponse
    {
        /// <summary>Data inicial do período</summary>
        public DateTime BeginDate { get; set; }
        
        /// <summary>Data final do período</summary>
        public DateTime EndDate { get; set; }
        
        /// <summary>Total de registros retornados</summary>
        public int TotalItems { get; set; }
        
        /// <summary>Quantidade total vendida</summary>
        public decimal TotalQuantity { get; set; }
        
        /// <summary>Valor total de vendas</summary>
        public decimal TotalSalesValue { get; set; }
        
        /// <summary>Margem média atual (%)</summary>
        public decimal AverageCurrentMargin { get; set; }
        
        /// <summary>Margem média nova (com rebaixa) (%)</summary>
        public decimal AverageNewMargin { get; set; }
        
        /// <summary>Lista de itens do relatório</summary>
        public List<PriceManagementReportItem> Items { get; set; }
        
        /// <summary>Data e hora de geração do relatório</summary>
        public DateTime GeneratedAt { get; set; }
    }
}
