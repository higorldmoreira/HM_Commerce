using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Api.Options;
using Api.Services;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/metabase")]
    public class MetabaseController : ControllerBase
    {
        private readonly ILogger<MetabaseController> _logger;
        private readonly IMetabaseApiService _metabaseApiService;
        private readonly IMetabaseEmbedService _metabaseEmbedService;
        private readonly MetabaseOptions _metabaseOptions;

        public MetabaseController(
            ILogger<MetabaseController> logger, 
            IMetabaseApiService metabaseApiService,
            IMetabaseEmbedService metabaseEmbedService,
            IOptions<MetabaseOptions> metabaseOptions)
        {
            _logger = logger;
            _metabaseApiService = metabaseApiService;
            _metabaseEmbedService = metabaseEmbedService;
            _metabaseOptions = metabaseOptions.Value;
        }

        /// <summary>
        /// Lista dashboards com embedding habilitado no Metabase
        /// Retorna apenas dashboards não arquivados e com incorporação habilitada
        /// </summary>
        /// <returns>Lista de dashboards disponíveis para embedding</returns>
        [HttpGet("dashboards")]
        [ProducesResponseType(typeof(IEnumerable<DashboardResponse>), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> GetDashboards()
        {
            try
            {
                _logger.LogInformation("Buscando dashboards com embedding habilitado do Metabase");
                
                var dashboards = await _metabaseApiService.GetEmbeddableDashboardsAsync();
                var result = dashboards.Select(d => new DashboardResponse 
                { 
                    Id = d.Id, 
                    Name = d.Name 
                }).ToList();
                
                _logger.LogInformation($"Retornando {result.Count} dashboards com embedding habilitado");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar dashboards do Metabase");
                return StatusCode(500, new ErrorResponse 
                { 
                    Message = "Erro ao buscar dashboards do Metabase",
                    Details = ex.Message
                });
            }
        }

        /// <summary>
        /// Gera URL de incorporação assinada para dashboard específico
        /// Valida se o dashboard existe e está habilitado para embedding antes de gerar a URL
        /// </summary>
        /// <param name="request">Dados da requisição contendo ID do dashboard e parâmetros</param>
        /// <returns>URL de incorporação assinada</returns>
        [HttpPost("dashboard-url")]
        [ProducesResponseType(typeof(DashboardUrlResponse), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 400)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> GetDashboardUrl([FromBody] DashboardUrlRequest request)
        {
            try
            {
                // Validação da entrada
                if (request == null)
                {
                    _logger.LogWarning("Requisição nula recebida");
                    return BadRequest(new ErrorResponse { Message = "Dados da requisição são obrigatórios" });
                }

                if (request.DashboardId <= 0)
                {
                    _logger.LogWarning($"DashboardId inválido: {request.DashboardId}");
                    return BadRequest(new ErrorResponse { Message = "dashboardId deve ser um inteiro maior que zero" });
                }

                _logger.LogInformation($"Gerando URL de embed para dashboard {request.DashboardId}");

                // Verificar se o dashboard existe e tem embedding habilitado
                var embedEnabled = await _metabaseApiService.IsDashboardEmbedEnabledAsync(request.DashboardId);
                if (!embedEnabled)
                {
                    _logger.LogWarning($"Dashboard {request.DashboardId} não encontrado ou embedding não habilitado");
                    return NotFound(new ErrorResponse 
                    { 
                        Message = "Dashboard não encontrado ou embedding não habilitado",
                        Details = "Verifique se o dashboard existe e se a opção 'Incorporação estática' está habilitada no Metabase"
                    });
                }

                // Gerar URL de incorporação usando o serviço centralizado
                var parameters = request.ParamsSelecionados ?? new Dictionary<string, object>();
                var embedOptions = new MetabaseEmbedOptions
                {
                    ExpirationMinutes = _metabaseOptions.EmbedExpMinutes,
                    Bordered = true,
                    Titled = true,
                    Theme = "light"
                };

                var url = _metabaseEmbedService.GetDashboardEmbedUrl(request.DashboardId, parameters, embedOptions);
                
                _logger.LogInformation($"URL de embed gerada com sucesso para dashboard {request.DashboardId}");
                return Ok(new DashboardUrlResponse { Url = url });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Argumentos inválidos para dashboard {request?.DashboardId}");
                return BadRequest(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao gerar URL de embed para dashboard {request?.DashboardId}");
                return StatusCode(500, new ErrorResponse 
                { 
                    Message = "Erro interno ao gerar URL do Metabase",
                    Details = ex.Message
                });
            }
        }

        /// <summary>
        /// Endpoint de diagnóstico detalhado para debug da conexão com Metabase
        /// </summary>
        [HttpGet("diagnose")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> Diagnose()
        {
            var diagnostics = new
            {
                Configuration = new
                {
                    Host = _metabaseOptions.Host,
                    HasSecret = !string.IsNullOrEmpty(_metabaseOptions.EmbedSecret),
                    HasEmail = !string.IsNullOrEmpty(_metabaseOptions.AdminEmail),
                    HasPassword = !string.IsNullOrEmpty(_metabaseOptions.AdminPassword),
                    ExpMinutes = _metabaseOptions.EmbedExpMinutes
                },
                Tests = new Dictionary<string, object>()
            };

            try
            {
                // Teste 1: Conectividade básica
                using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
                try
                {
                    var healthResponse = await httpClient.GetAsync($"{_metabaseOptions.Host}/api/health");
                    diagnostics.Tests.Add("BasicConnectivity", new { Success = healthResponse.IsSuccessStatusCode, StatusCode = (int)healthResponse.StatusCode });
                }
                catch (Exception ex)
                {
                    diagnostics.Tests.Add("BasicConnectivity", new { Success = false, Error = ex.Message });
                }

                // Teste 2: Autenticação
                try
                {
                    await _metabaseApiService.GetSessionAsync();
                    diagnostics.Tests.Add("Authentication", new { Success = true, Message = "Autenticação bem-sucedida" });
                }
                catch (Exception ex)
                {
                    diagnostics.Tests.Add("Authentication", new { Success = false, Error = ex.Message });
                }

                // Teste 3: Buscar dashboards
                try
                {
                    var dashboards = await _metabaseApiService.GetEmbeddableDashboardsAsync();
                    diagnostics.Tests.Add("FetchDashboards", new { Success = true, Count = dashboards.Count });
                }
                catch (Exception ex)
                {
                    diagnostics.Tests.Add("FetchDashboards", new { Success = false, Error = ex.Message });
                }

                // Teste 4: Embedding
                try
                {
                    var embedHealth = await _metabaseEmbedService.HealthAsync();
                    diagnostics.Tests.Add("Embedding", new { Success = embedHealth, Message = embedHealth ? "Serviço de embedding OK" : "Falha no serviço de embedding" });
                }
                catch (Exception ex)
                {
                    diagnostics.Tests.Add("Embedding", new { Success = false, Error = ex.Message });
                }

                return Ok(diagnostics);
            }
            catch (Exception ex)
            {
                diagnostics.Tests.Add("General", new { Success = false, Error = ex.Message, StackTrace = ex.StackTrace });
                return StatusCode(500, diagnostics);
            }
        }

        /// <summary>
        /// Verifica saúde do Metabase e conectividade dos serviços
        /// </summary>
        /// <returns>Status de saúde do Metabase</returns>
        [HttpGet("health")]
        [ProducesResponseType(typeof(HealthResponse), 200)]
        [ProducesResponseType(typeof(HealthResponse), 503)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> GetHealth()
        {
            try
            {
                _logger.LogInformation("Executando health check do Metabase");
                
                var isApiHealthy = await _metabaseApiService.CheckHealthAsync();
                var isEmbedHealthy = await _metabaseEmbedService.HealthAsync();
                var currentTime = DateTimeOffset.UtcNow;
                
                var result = new HealthResponse
                { 
                    Healthy = isApiHealthy && isEmbedHealthy,
                    ApiHealthy = isApiHealthy,
                    EmbedHealthy = isEmbedHealthy,
                    Timestamp = currentTime.ToUnixTimeSeconds(),
                    Time = currentTime.ToString("yyyy-MM-dd HH:mm:ss UTC"),
                    MetabaseUrl = _metabaseOptions.Host
                };
                
                if (result.Healthy)
                {
                    _logger.LogInformation("Health check do Metabase OK");
                    return Ok(result);
                }
                else
                {
                    _logger.LogWarning($"Health check do Metabase falhou - API: {isApiHealthy}, Embed: {isEmbedHealthy}");
                    return StatusCode(503, result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no health check do Metabase");
                return StatusCode(500, new ErrorResponse 
                { 
                    Message = "Erro ao verificar saúde do Metabase",
                    Details = ex.Message
                });
            }
        }
    }

    #region DTOs

    public class DashboardUrlRequest
    {
        /// <summary>ID do dashboard no Metabase</summary>
        public int DashboardId { get; set; }
        
        /// <summary>Parâmetros de filtro para o dashboard</summary>
        public Dictionary<string, object> ParamsSelecionados { get; set; }
    }
    
    public class DashboardResponse
    {
        /// <summary>ID único do dashboard</summary>
        public int Id { get; set; }
        
        /// <summary>Nome do dashboard</summary>
        public string Name { get; set; }
    }
    
    public class DashboardUrlResponse 
    { 
        /// <summary>URL completa para incorporação do dashboard</summary>
        public string Url { get; set; } 
    }

    public class HealthResponse
    {
        /// <summary>Status geral de saúde</summary>
        public bool Healthy { get; set; }
        
        /// <summary>Status da API do Metabase</summary>
        public bool ApiHealthy { get; set; }
        
        /// <summary>Status do serviço de embedding</summary>
        public bool EmbedHealthy { get; set; }
        
        /// <summary>Timestamp Unix</summary>
        public long Timestamp { get; set; }
        
        /// <summary>Data/hora legível</summary>
        public string Time { get; set; }
        
        /// <summary>URL do Metabase configurada</summary>
        public string MetabaseUrl { get; set; }
    }

    public class ErrorResponse
    {
        /// <summary>Mensagem principal do erro</summary>
        public string Message { get; set; }
        
        /// <summary>Detalhes adicionais do erro</summary>
        public string Details { get; set; }
    }

    #endregion
}
