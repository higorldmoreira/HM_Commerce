using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Api.Models.Reports;
using Api.Services.Reports;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly ILogger<ReportsController> _logger;
        private readonly IPriceManagementReportService _priceManagementService;

        public ReportsController(
            ILogger<ReportsController> logger,
            IPriceManagementReportService priceManagementService)
        {
            _logger = logger;
            _priceManagementService = priceManagementService;
        }

        /// <summary>
        /// Gera o relatório de Gestão de Preço usando a stored procedure stpInvoiceItemResumo
        /// </summary>
        /// <param name="request">Parâmetros do relatório (Data Início e Data Final)</param>
        /// <returns>Dados consolidados do relatório de Gestão de Preço</returns>
        [HttpPost("gestao-preco")]
        [ProducesResponseType(typeof(PriceManagementReportResponse), 200)]
        [ProducesResponseType(typeof(ReportErrorResponse), 400)]
        [ProducesResponseType(typeof(ReportErrorResponse), 500)]
        public async Task<IActionResult> GetPriceManagementReport([FromBody] PriceManagementReportRequest request)
        {
            try
            {
                _logger.LogInformation($"Requisição de relatório de Gestão de Preço recebida - Período: {request.BeginDate:dd/MM/yyyy} a {request.EndDate:dd/MM/yyyy}");

                // Validações
                if (request.BeginDate > request.EndDate)
                {
                    return BadRequest(new ReportErrorResponse 
                    { 
                        Message = "Data Início não pode ser maior que Data Final",
                        Details = $"Data Início: {request.BeginDate:dd/MM/yyyy}, Data Final: {request.EndDate:dd/MM/yyyy}"
                    });
                }

                if (request.BeginDate > DateTime.Now)
                {
                    return BadRequest(new ReportErrorResponse 
                    { 
                        Message = "Data Início não pode ser maior que a data atual"
                    });
                }

                // Validar período máximo (1 ano)
                var diffDays = (request.EndDate - request.BeginDate).TotalDays;
                if (diffDays > 365)
                {
                    return BadRequest(new ReportErrorResponse 
                    { 
                        Message = "O período máximo permitido é de 1 ano (365 dias)",
                        Details = $"Período solicitado: {diffDays} dias"
                    });
                }

                var result = await _priceManagementService.GenerateReportAsync(request);
                
                _logger.LogInformation($"Relatório gerado com sucesso - {result.TotalItems} registros, Quantidade: {result.TotalQuantity:N2}, Valor Total: R$ {result.TotalSalesValue:N2}");
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Erro ao processar relatório de Gestão de Preço");
                return StatusCode(500, new ReportErrorResponse 
                { 
                    Message = "Erro ao gerar relatório de Gestão de Preço",
                    Details = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro inesperado ao processar relatório");
                return StatusCode(500, new ReportErrorResponse 
                { 
                    Message = "Erro interno ao processar relatório",
                    Details = ex.Message
                });
            }
        }

        /// <summary>
        /// Gera o relatório de Gestão de Preço via GET (para facilitar testes)
        /// </summary>
        /// <param name="beginDate">Data inicial (formato: yyyy-MM-dd)</param>
        /// <param name="endDate">Data final (formato: yyyy-MM-dd)</param>
        [HttpGet("gestao-preco")]
        [ProducesResponseType(typeof(PriceManagementReportResponse), 200)]
        [ProducesResponseType(typeof(ReportErrorResponse), 400)]
        public async Task<IActionResult> GetPriceManagementReportGet(
            [FromQuery] DateTime beginDate,
            [FromQuery] DateTime endDate)
        {
            var request = new PriceManagementReportRequest
            {
                BeginDate = beginDate,
                EndDate = endDate
            };

            return await GetPriceManagementReport(request);
        }
    }

    /// <summary>
    /// Modelo de resposta de erro para relatórios
    /// </summary>
    public class ReportErrorResponse
    {
        /// <summary>Mensagem principal do erro</summary>
        public string Message { get; set; }
        
        /// <summary>Detalhes adicionais do erro</summary>
        public string Details { get; set; }
    }
}
