namespace Api.Options
{
    public class MetabaseOptions
    {
        public const string SectionName = "Metabase";
        
        /// <summary>
        /// URL base do Metabase (ex: http://192.168.0.10:3000) - Usado para comunicação interna da API
        /// </summary>
        public string SiteUrl { get; set; } = "http://192.168.0.10:3000";
        
        /// <summary>
        /// URL externa do Metabase (ex: http://186.193.151.211:30500) - Usado para gerar URLs de embedding
        /// </summary>
        public string SiteUrlExternal { get; set; }
        
        /// <summary>
        /// Host do Metabase - alias para SiteUrl para compatibilidade
        /// </summary>
        public string Host => SiteUrl?.TrimEnd('/');
        
        /// <summary>
        /// Host externo - Retorna SiteUrlExternal se configurado, caso contrário usa SiteUrl
        /// </summary>
        public string HostExternal => !string.IsNullOrEmpty(SiteUrlExternal) ? SiteUrlExternal.TrimEnd('/') : Host;
        
        /// <summary>
        /// Secret para assinatura de tokens JWT de embedding
        /// </summary>
        public string EmbedSecret { get; set; } = "1392b08f27c85dc0a9855a4135cfcaf64f871fb47c3a3ece4648b1c88cabc31f";
        
        /// <summary>
        /// Tempo de expiração dos tokens de embedding em minutos
        /// </summary>
        public int EmbedExpMinutes { get; set; } = 10;
        
        /// <summary>
        /// Email do administrador para autenticação na API
        /// </summary>
        public string AdminEmail { get; set; } = "higor@mbasistemas.com";
        
        /// <summary>
        /// Senha do administrador para autenticação na API
        /// </summary>
        public string AdminPassword { get; set; } = "6plBuGKjzzqymp";
    }
}