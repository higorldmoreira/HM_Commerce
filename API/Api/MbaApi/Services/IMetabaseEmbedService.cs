using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface IMetabaseEmbedService
    {
        string GetDashboardEmbedUrl(int dashboardId, Dictionary<string, object> parameters, MetabaseEmbedOptions options = null);
        string GetQuestionEmbedUrl(int questionId, Dictionary<string, object> parameters, MetabaseEmbedOptions options = null);
        Task<bool> HealthAsync();
    }

    public class MetabaseEmbedOptions
    {
        public bool Bordered { get; set; } = true;
        public bool Titled { get; set; } = true;
        public string Theme { get; set; } = "light";
        public int ExpirationMinutes { get; set; } = 10;
    }
}
