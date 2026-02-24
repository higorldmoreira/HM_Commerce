using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Api.Options;

namespace Api.Services
{
    public interface IMetabaseApiService
    {
        Task<string> GetSessionAsync();
        Task<List<DashboardInfo>> GetEmbeddableDashboardsAsync();
        Task<bool> IsDashboardEmbedEnabledAsync(int dashboardId);
        Task<bool> CheckHealthAsync();
    }

    public class DashboardInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Archived { get; set; }
        public bool EnableEmbedding { get; set; }
    }

    public class MetabaseApiService : IMetabaseApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<MetabaseApiService> _logger;
        private readonly MetabaseOptions _options;
        private string _sessionId;
        private DateTime _sessionExpiry;

        public MetabaseApiService(
            HttpClient httpClient, 
            ILogger<MetabaseApiService> logger,
            IOptions<MetabaseOptions> options)
        {
            _httpClient = httpClient;
            _logger = logger;
            _options = options.Value;
        }

        public async Task<string> GetSessionAsync()
        {
            if (!string.IsNullOrEmpty(_sessionId) && DateTime.UtcNow < _sessionExpiry)
            {
                _logger.LogDebug("Usando sessão existente do Metabase");
                return _sessionId;
            }

            try
            {
                var loginData = new
                {
                    username = Environment.GetEnvironmentVariable("METABASE_ADMIN_EMAIL") ?? _options.AdminEmail,
                    password = Environment.GetEnvironmentVariable("METABASE_ADMIN_PASSWORD") ?? _options.AdminPassword
                };

                _logger.LogInformation($"=== INICIANDO AUTENTICAÇÃO METABASE ===");
                _logger.LogInformation($"Host: {_options.Host}");
                _logger.LogInformation($"Endpoint: {_options.Host}/api/session");
                _logger.LogInformation($"Usuário: {loginData.username}");
                _logger.LogInformation($"HttpClient Timeout: {_httpClient.Timeout.TotalSeconds}s");

                var json = JsonSerializer.Serialize(loginData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                _logger.LogInformation("Enviando requisição POST...");
                var response = await _httpClient.PostAsync($"{_options.Host}/api/session", content);
                
                _logger.LogInformation($"Status Code: {response.StatusCode}");
                _logger.LogInformation($"Response Headers: {string.Join(", ", response.Headers.Select(h => $"{h.Key}={string.Join(",", h.Value)}"))}");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Falha na autenticação do Metabase: {response.StatusCode} - {errorContent}");
                    throw new Exception($"Credenciais do Metabase inválidas: {response.StatusCode} - {errorContent}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogDebug($"Resposta de autenticação: {responseContent}");
                
                var sessionResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                
                _sessionId = sessionResponse.GetProperty("id").GetString();
                _sessionExpiry = DateTime.UtcNow.AddMinutes(25);
                
                _logger.LogInformation($"? Sessão do Metabase criada com sucesso. ID: {_sessionId?.Substring(0, Math.Min(8, _sessionId.Length))}...");
                _logger.LogInformation($"=== FIM AUTENTICAÇÃO METABASE ===");
                return _sessionId;
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, $"? Erro HTTP ao criar sessão no Metabase. Host: {_options.Host}");
                _logger.LogError($"Detalhes: StatusCode={httpEx.StatusCode}, Message={httpEx.Message}");
                throw;
            }
            catch (TaskCanceledException timeoutEx)
            {
                _logger.LogError(timeoutEx, $"? TIMEOUT ao criar sessão no Metabase. Host: {_options.Host}, Timeout: {_httpClient.Timeout.TotalSeconds}s");
                throw new Exception($"Timeout ao conectar no Metabase após {_httpClient.Timeout.TotalSeconds}s. Verifique conectividade de rede.", timeoutEx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"? Erro desconhecido ao criar sessão no Metabase. Host: {_options.Host}");
                throw;
            }
        }

        public async Task<List<DashboardInfo>> GetEmbeddableDashboardsAsync()
        {
            try
            {
                var sessionId = await GetSessionAsync();
                
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("X-Metabase-Session", sessionId);
                
                var response = await _httpClient.GetAsync($"{_options.Host}/api/dashboard");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Falha ao buscar dashboards: {response.StatusCode} - {errorContent}");
                    throw new Exception("Erro ao buscar dashboards do Metabase");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var dashboardsArray = JsonSerializer.Deserialize<JsonElement>(responseContent);
                
                var dashboards = new List<DashboardInfo>();
                
                foreach (var dashboard in dashboardsArray.EnumerateArray())
                {
                    var id = dashboard.GetProperty("id").GetInt32();
                    var name = dashboard.GetProperty("name").GetString();
                    var archived = dashboard.TryGetProperty("archived", out var archivedProp) ? archivedProp.GetBoolean() : false;
                    var enableEmbedding = dashboard.TryGetProperty("enable_embedding", out var embedProp) ? embedProp.GetBoolean() : false;
                    
                    // Apenas dashboards não arquivados com embedding habilitado
                    if (!archived && enableEmbedding)
                    {
                        dashboards.Add(new DashboardInfo
                        {
                            Id = id,
                            Name = name,
                            Archived = archived,
                            EnableEmbedding = enableEmbedding
                        });
                    }
                }
                
                // Ordenar por nome
                dashboards = dashboards.OrderBy(d => d.Name).ToList();
                
                _logger.LogInformation($"Encontrados {dashboards.Count} dashboards com embedding habilitado");
                return dashboards;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar dashboards do Metabase");
                throw;
            }
        }

        public async Task<bool> IsDashboardEmbedEnabledAsync(int dashboardId)
        {
            try
            {
                var sessionId = await GetSessionAsync();
                
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("X-Metabase-Session", sessionId);
                
                // Buscar detalhes específicos do dashboard
                var response = await _httpClient.GetAsync($"{_options.Host}/api/dashboard/{dashboardId}");
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Dashboard {dashboardId} não encontrado ou inacessível");
                    return false;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var dashboard = JsonSerializer.Deserialize<JsonElement>(responseContent);
                
                var enableEmbedding = dashboard.TryGetProperty("enable_embedding", out var embedProp) ? embedProp.GetBoolean() : false;
                var archived = dashboard.TryGetProperty("archived", out var archivedProp) ? archivedProp.GetBoolean() : false;
                
                return enableEmbedding && !archived;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Erro ao verificar embedding para dashboard {dashboardId}");
                return false;
            }
        }

        public async Task<bool> CheckHealthAsync()
        {
            try
            {
                // Verificar acessibilidade do Metabase
                var response = await _httpClient.GetAsync($"{_options.Host}/api/health");
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Metabase health check falhou: {response.StatusCode}");
                    return false;
                }
                
                // Verificar se consegue criar uma sessão
                await GetSessionAsync();
                
                _logger.LogInformation("Metabase API health check OK");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Falha no health check da API do Metabase");
                return false;
            }
        }
    }
}