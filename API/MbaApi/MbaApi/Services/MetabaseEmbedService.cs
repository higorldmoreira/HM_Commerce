using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Jose;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Api.Options;

namespace Api.Services
{
    public class MetabaseEmbedService : IMetabaseEmbedService
    {
        private readonly MetabaseOptions _options;
        private readonly ILogger<MetabaseEmbedService> _logger;

        public MetabaseEmbedService(
            IOptions<MetabaseOptions> options,
            ILogger<MetabaseEmbedService> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public string GetDashboardEmbedUrl(int dashboardId, Dictionary<string, object> parameters, MetabaseEmbedOptions embedOptions = null)
        {
            if (dashboardId <= 0)
                throw new ArgumentException("dashboardId deve ser maior que zero.", nameof(dashboardId));
            
            if (string.IsNullOrWhiteSpace(_options.HostExternal))
                throw new InvalidOperationException("Host do Metabase não configurado.");
            
            if (string.IsNullOrWhiteSpace(_options.EmbedSecret))
                throw new InvalidOperationException("EmbedSecret do Metabase não configurado.");

            try
            {
                embedOptions ??= new MetabaseEmbedOptions();
                var exp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (embedOptions.ExpirationMinutes * 60);
                
                var payload = new Dictionary<string, object>
                {
                    { "resource", new Dictionary<string, object> { { "dashboard", dashboardId } } },
                    { "params", parameters ?? new Dictionary<string, object>() },
                    { "exp", exp }
                };

                var secretBytes = Encoding.UTF8.GetBytes(_options.EmbedSecret);
                var token = JWT.Encode(payload, secretBytes, JwsAlgorithm.HS256);
                
                // Usar HostExternal para URLs públicas de embedding
                var baseUrl = $"{_options.HostExternal.TrimEnd('/')}/embed/dashboard/{token}";
                var urlParams = new List<string>();
                
                if (embedOptions.Bordered)
                    urlParams.Add("bordered=true");
                
                if (embedOptions.Titled)
                    urlParams.Add("titled=true");
                
                if (!string.IsNullOrEmpty(embedOptions.Theme))
                    urlParams.Add($"theme={embedOptions.Theme}");

                var url = urlParams.Count > 0 ? $"{baseUrl}#{string.Join("&", urlParams)}" : baseUrl;
                
                _logger.LogDebug($"URL de embed gerada para dashboard {dashboardId}: {url.Substring(0, Math.Min(100, url.Length))}...");
                return url;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao gerar URL de embed para dashboard {dashboardId}");
                throw new InvalidOperationException($"Erro ao gerar URL de embed: {ex.Message}", ex);
            }
        }

        public string GetQuestionEmbedUrl(int questionId, Dictionary<string, object> parameters, MetabaseEmbedOptions embedOptions = null)
        {
            if (questionId <= 0)
                throw new ArgumentException("questionId deve ser maior que zero.", nameof(questionId));
            
            if (string.IsNullOrWhiteSpace(_options.HostExternal))
                throw new InvalidOperationException("Host do Metabase não configurado.");
            
            if (string.IsNullOrWhiteSpace(_options.EmbedSecret))
                throw new InvalidOperationException("EmbedSecret do Metabase não configurado.");

            try
            {
                embedOptions ??= new MetabaseEmbedOptions();
                var exp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (embedOptions.ExpirationMinutes * 60);
                
                var payload = new Dictionary<string, object>
                {
                    { "resource", new Dictionary<string, object> { { "question", questionId } } },
                    { "params", parameters ?? new Dictionary<string, object>() },
                    { "exp", exp }
                };

                var secretBytes = Encoding.UTF8.GetBytes(_options.EmbedSecret);
                var token = JWT.Encode(payload, secretBytes, JwsAlgorithm.HS256);
                
                // Usar HostExternal para URLs públicas de embedding
                var baseUrl = $"{_options.HostExternal.TrimEnd('/')}/embed/question/{token}";
                var urlParams = new List<string>();
                
                if (embedOptions.Bordered)
                    urlParams.Add("bordered=true");
                
                if (embedOptions.Titled)
                    urlParams.Add("titled=true");
                
                if (!string.IsNullOrEmpty(embedOptions.Theme))
                    urlParams.Add($"theme={embedOptions.Theme}");

                var url = urlParams.Count > 0 ? $"{baseUrl}#{string.Join("&", urlParams)}" : baseUrl;
                
                _logger.LogDebug($"URL de embed gerada para question {questionId}: {url.Substring(0, Math.Min(100, url.Length))}...");
                return url;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erro ao gerar URL de embed para question {questionId}");
                throw new InvalidOperationException($"Erro ao gerar URL de embed: {ex.Message}", ex);
            }
        }

        public Task<bool> HealthAsync()
        {
            try
            {
                // Verificar se as configurações essenciais estão presentes
                var hasHost = !string.IsNullOrWhiteSpace(_options.Host);
                var hasSecret = !string.IsNullOrWhiteSpace(_options.EmbedSecret);
                
                if (!hasHost || !hasSecret)
                {
                    _logger.LogWarning($"Configuração do Metabase incompleta - Host: {hasHost}, Secret: {hasSecret}");
                    return Task.FromResult(false);
                }

                // Testar geração de token JWT
                var testPayload = new Dictionary<string, object>
                {
                    { "resource", new Dictionary<string, object> { { "dashboard", 1 } } },
                    { "params", new Dictionary<string, object>() },
                    { "exp", DateTimeOffset.UtcNow.ToUnixTimeSeconds() + 60 }
                };

                var secretBytes = Encoding.UTF8.GetBytes(_options.EmbedSecret);
                var testToken = JWT.Encode(testPayload, secretBytes, JwsAlgorithm.HS256);
                
                // Se chegou até aqui, o serviço está funcionando
                _logger.LogDebug("MetabaseEmbedService health check OK");
                return Task.FromResult(!string.IsNullOrEmpty(testToken));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Falha no health check do MetabaseEmbedService");
                return Task.FromResult(false);
            }
        }
    }
}
