using System;
using System.Collections.Generic;
using System.Data;
using MySqlConnector;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Api.Models.Reports;

namespace Api.Services.Reports
{
    public interface IPriceManagementReportService
    {
        Task<PriceManagementReportResponse> GenerateReportAsync(PriceManagementReportRequest request);
    }

    public class PriceManagementReportService : IPriceManagementReportService
    {
        private readonly string _connectionString;
        private readonly ILogger<PriceManagementReportService> _logger;

        public PriceManagementReportService(
            IConfiguration configuration,
            ILogger<PriceManagementReportService> logger)
        {
            _connectionString = configuration.GetConnectionString("Commerce");
            _logger = logger;
        }

        public async Task<PriceManagementReportResponse> GenerateReportAsync(PriceManagementReportRequest request)
        {
            _logger.LogInformation($"Gerando relat�rio de Gest�o de Pre�o - Per�odo: {request.BeginDate:dd/MM/yyyy} a {request.EndDate:dd/MM/yyyy}");

            var items = new List<PriceManagementReportItem>();

            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                _logger.LogDebug($"Conex\u00e3o com banco de dados estabelecida");

                using var command = new MySqlCommand("stpInvoiceItemResumo", connection)
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandTimeout = 300 // 5 minutos
                };

                // Adicionar par�metros conforme definido na stored procedure
                command.Parameters.AddWithValue("@beginDate", request.BeginDate.Date);
                command.Parameters.AddWithValue("@endDate", request.EndDate.Date);

                _logger.LogDebug($"Executando stored procedure stpInvoiceItemResumo");

                using var reader = await command.ExecuteReaderAsync();
                
                var recordCount = 0;
                while (await reader.ReadAsync())
                {
                    recordCount++;
                    
                    try
                    {
                        items.Add(new PriceManagementReportItem
                        {
                            BranchId = reader.GetInt64Safe("branchId"),
                            BranchNickName = reader.GetStringSafe("branchNickName"),
                            InvoiceIssueDate = reader.GetDateTimeSafe("invoiceIssueDate"),
                            Condition = reader.GetStringSafe("condition"), // Alterado para string
                            SupervisorId = reader.GetInt64NullableSafe("supervisorId"),
                            SupervisorNickName = reader.GetStringSafe("supervisorNickName"),
                            SellerId = reader.GetInt64Safe("sellerId"),
                            SellerNickName = reader.GetStringSafe("sellerNickName"),
                            ClientStateAcronym = reader.GetStringSafe("clientStateAcronym"),
                            Quantity = reader.GetDecimalSafe("quantity"),
                            SalePriceUnit = reader.GetDecimalSafe("salePriceUnit"),
                            ProductCostPrice = reader.GetDecimalSafe("productCostPrice"),
                            ProductCostPriceUnit = reader.GetDecimalSafe("productCostPriceUNit"),
                            AverageCostPriceProduct = reader.GetDecimalSafe("averageCostPriceProduct"),
                            AverageCostPriceProductUnit = reader.GetDecimalSafe("averageCostPriceProductUnit"),
                            DemotesValue = reader.GetDecimalSafe("demotesValue"),
                            DemotesValueUnit = reader.GetDecimalSafe("demotesValueUnit"),
                            DemotesCostValue = reader.GetDecimalSafe("demotesCostValue"),
                            DemotesCostValueUnit = reader.GetDecimalSafe("demotesCostValueUnit"),
                            CurrentMargin = reader.GetDecimalSafe("currentMargin"),
                            CurrentMarginUnit = reader.GetDecimalSafe("currentMarginUnit"),
                            NewMargin = reader.GetDecimalSafe("newMargin"),
                            NewMarginUnit = reader.GetDecimalSafe("newMarginUnit")
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Erro ao processar registro #{recordCount}. Campos: BranchId, Condition, SellerId");
                        throw;
                    }
                }

                _logger.LogInformation($"Stored procedure executada com sucesso - {items.Count} registros processados");

                // Calcular totalizadores
                var totalQuantity = items.Sum(i => i.Quantity);
                var totalSalesValue = items.Sum(i => i.Quantity * i.SalePriceUnit);
                var avgCurrentMargin = items.Any() ? items.Average(i => i.CurrentMargin) : 0;
                var avgNewMargin = items.Any() ? items.Average(i => i.NewMargin) : 0;

                _logger.LogInformation($"Totalizadores calculados - Qtd: {totalQuantity:N2}, Valor: R$ {totalSalesValue:N2}, Margem Atual: {avgCurrentMargin:N2}%, Margem Nova: {avgNewMargin:N2}%");

                return new PriceManagementReportResponse
                {
                    BeginDate = request.BeginDate,
                    EndDate = request.EndDate,
                    TotalItems = items.Count,
                    TotalQuantity = totalQuantity,
                    TotalSalesValue = totalSalesValue,
                    AverageCurrentMargin = avgCurrentMargin,
                    AverageNewMargin = avgNewMargin,
                    Items = items,
                    GeneratedAt = DateTime.Now
                };
            }
            catch (MySqlException ex)
            {
                _logger.LogError(ex, $"Erro MySQL ao executar stored procedure stpInvoiceItemResumo - ErrorCode: {ex.ErrorCode}");
                throw new InvalidOperationException($"Erro ao gerar relat�rio de Gest�o de Pre�o: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro inesperado ao gerar relat�rio");
                throw;
            }
        }
    }

    /// <summary>
    /// M�todos de extens�o para leitura segura de SqlDataReader
    /// </summary>
    public static class MySqlDataReaderExtensions
    {
        public static long GetInt64Safe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
                return 0;
            
            // Suportar tanto Int32 quanto Int64
            var value = reader.GetValue(ordinal);
            if (value is int intValue)
                return intValue;
            if (value is long longValue)
                return longValue;
            
            return Convert.ToInt64(value);
        }

        public static long? GetInt64NullableSafe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
                return null;
            
            // Suportar tanto Int32 quanto Int64
            var value = reader.GetValue(ordinal);
            if (value is int intValue)
                return intValue;
            if (value is long longValue)
                return longValue;
            
            return Convert.ToInt64(value);
        }

        public static int GetInt32Safe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
                return 0;
            
            // Suportar tanto Int32 quanto Int64 (converter se necess�rio)
            var value = reader.GetValue(ordinal);
            if (value is int intValue)
                return intValue;
            if (value is long longValue)
                return (int)longValue;
            
            return Convert.ToInt32(value);
        }

        public static string GetStringSafe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
                return string.Empty;
            
            // Suportar convers�o de n�meros para string
            var value = reader.GetValue(ordinal);
            return value?.ToString() ?? string.Empty;
        }

        public static DateTime GetDateTimeSafe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            return reader.IsDBNull(ordinal) ? DateTime.MinValue : reader.GetDateTime(ordinal);
        }

        public static decimal GetDecimalSafe(this MySqlDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
                return 0;
            
            // Suportar diferentes tipos num�ricos
            var value = reader.GetValue(ordinal);
            if (value is decimal decimalValue)
                return decimalValue;
            if (value is double doubleValue)
                return (decimal)doubleValue;
            if (value is float floatValue)
                return (decimal)floatValue;
            if (value is int intValue)
                return intValue;
            if (value is long longValue)
                return longValue;
            
            return Convert.ToDecimal(value);
        }
    }
}
