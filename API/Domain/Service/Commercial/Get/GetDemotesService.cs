using System;
using System.Collections.Generic;
using MySqlConnector;
using System.Linq;
using System.Threading.Tasks;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Service.Generic.BaseServices;
using Domain.Util;
using Microsoft.Extensions.Configuration;

namespace Domain.Service.Commercial.Get
{
    public class GetDemotesService : BaseQueryService<InvoiceItemDemotes, DemotesParameters>
    {
        private readonly IConfiguration _configuration;

        public GetDemotesService(string connectionString, IConfiguration configuration)
            : base(connectionString)
        {
            _configuration = configuration;
        }

        protected override string GetQuery() =>
            @"CALL stpGetInvoiceItemDemotes(
                @branchId, 
                @beginDate, 
                @endDate, 
                @conditionId, 
                @stateAcronym, 
                @supplierId, 
                @productId)";

        protected override void AddParameters(MySqlCommand command, DemotesParameters parameters)
        {
            command.Parameters.AddWithValue("@branchId", parameters.branchId.HasValue ? (object)(parameters.branchId.Value / 10) : DBNull.Value);
            command.Parameters.AddWithValue("@beginDate", ValidateSqlDateTime(parameters.beginDate));
            command.Parameters.AddWithValue("@endDate", ValidateSqlDateTime(parameters.endDate));
            command.Parameters.AddWithValue("@conditionId", string.IsNullOrWhiteSpace(parameters.conditionId) ? DBNull.Value : (object)parameters.conditionId);
            command.Parameters.AddWithValue("@stateAcronym", string.IsNullOrWhiteSpace(parameters.stateAcronym) ? DBNull.Value : (object)parameters.stateAcronym);
            command.Parameters.AddWithValue("@supplierId", parameters.supplierId > 0 ? (object)(parameters.supplierId / 10) : DBNull.Value);
            command.Parameters.AddWithValue("@productId", parameters.productId.HasValue && parameters.productId.Value > 0 ? (object)(parameters.productId.Value / 10) : DBNull.Value);            
        }

        protected override InvoiceItemDemotes MapReader(MySqlDataReader reader)
        {
            return new InvoiceItemDemotes
            {
                branchId = reader.GetFieldValueOrDefault<int>("branchId") ?? 0,
                branchName = reader["branchName"] as string,
                branchNickName = reader["branchNickName"] as string,
                clientId = reader.GetFieldValueOrDefault<int>("clientId") ?? 0,
                clientName = reader["clientName"] as string,
                clientNickName = reader["clientNickName"] as string,
                clientStateAcronym = reader["clientStateAcronym"] as string,
                supplierId = reader.GetFieldValueOrDefault<int>("supplierId") ?? 0,
                supplierName = reader["supplierName"] as string,
                supplierNickName = reader["supplierNickName"] as string,
                invoiceIssueDate = reader.GetFieldValueOrDefault<DateTime>("invoiceIssueDate") ?? new DateTime(1900, 1, 1),
                invoiceId = reader.GetFieldValueOrDefault<int>("invoiceId") ?? 0,
                invoiceNumber = reader["invoiceNumber"] as string,
                invoiceSeries = reader["invoiceSeries"] as string,
                productId = reader.GetFieldValueOrDefault<int>("productId") ?? 0,
                productName = reader["productName"] as string,
                conditionId = reader.GetFieldValueOrDefault<int>("conditionId") ?? 0,
                conditionName = reader["conditionName"] as string,
                quantitySold = reader.GetFieldValueOrDefault<decimal>("quantitySold") ?? 0,
                salePrice = reader.GetFieldValueOrDefault<decimal>("SalePrice") ?? 0,
                salePriceUnit = reader.GetFieldValueOrDefault<decimal>("salePriceUnit") ?? 0,
                productCostPrice = reader.GetFieldValueOrDefault<decimal>("productCostPrice") ?? 0,
                productCostPriceUnit = reader.GetFieldValueOrDefault<decimal>("productCostPriceUnit") ?? 0,
                averageCostPriceProduct = reader.GetFieldValueOrDefault<decimal>("averageCostPriceProduct") ?? 0,
                averageCostPriceProductUnit = reader.GetFieldValueOrDefault<decimal>("averageCostPriceProductUnit") ?? 0,
                demotesValue = reader.GetFieldValueOrDefault<decimal>("demotesValue") ?? 0,
                demotesValueUnit = reader.GetFieldValueOrDefault<decimal>("demotesValueUnit") ?? 0,
                demotesCostValue = reader.GetFieldValueOrDefault<decimal>("demotesCostValue") ?? 0,
                demotesCostValueUnit = reader.GetFieldValueOrDefault<decimal>("demotesCostValueUnit") ?? 0,
                currentMargin = reader.GetFieldValueOrDefault<decimal>("currentMargin") ?? 0,
                currentMarginUnit = reader.GetFieldValueOrDefault<decimal>("currentMarginUnit") ?? 0,
                newMargin = reader.GetFieldValueOrDefault<decimal>("newMargin") ?? 0,
                newMarginUnit = reader.GetFieldValueOrDefault<decimal>("newMarginUnit") ?? 0,
                supplierBalance = reader.GetFieldValueOrDefault<decimal>("supplierBalance") ?? 0
            };
        }

        public async Task<List<Demotes>> ExecuteWithGroupingAsync(DemotesParameters parameters)
        {
            var invoiceItems = await ExecuteAsync(parameters);

            return invoiceItems
                .GroupBy(i => new
                {
                    i.branchId,
                    i.clientStateAcronym,
                    i.supplierId,
                    i.productId,
                    i.conditionId,
                    i.supplierBalance
                })
                .Select(g => new Demotes
                {
                    branchId = g.Key.branchId,
                    clientStateAcronym = g.Key.clientStateAcronym,
                    supplierId = g.Key.supplierId,
                    productId = g.Key.productId,
                    conditionId = g.Key.conditionId,
                    supplierBalance = g.Key.supplierBalance,
                    branchName = g.First().branchName,
                    branchNickName = g.First().branchNickName,
                    supplierName = g.First().supplierName,
                    supplierNickName = g.First().supplierNickName,
                    productName = g.First().productName,
                    conditionName = g.First().conditionName,
                    quantitySold = g.Sum(x => x.quantitySold),
                    salePrice = g.Sum(x => x.salePrice),
                    salePriceUnit = g.Average(x => x.salePriceUnit),
                    productCostPrice = g.Sum(x => x.productCostPrice),
                    productCostPriceUnit = g.Average(x => x.productCostPriceUnit),
                    averageCostPriceProduct = g.Sum(x => x.averageCostPriceProduct),
                    averageCostPriceProductUnit = g.Average(x => x.averageCostPriceProductUnit),
                    demotesValue = g.Sum(x => x.demotesValue),
                    demotesValueUnit = g.Average(x => x.demotesValueUnit),
                    demotesCostValue = g.Sum(x => x.demotesCostValue),
                    demotesCostValueUnit = g.Average(x => x.demotesCostValueUnit),
                    currentMargin = g.Average(x => x.currentMargin),
                    currentMarginUnit = g.Average(x => x.currentMarginUnit),
                    newMargin = g.Average(x => x.newMargin),
                    newMarginUnit = g.Average(x => x.newMarginUnit),
                    Items = g.ToList()
                }).ToList();
        }
    }
}
