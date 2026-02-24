namespace Api.Options
{
    public class MetabaseOptions
    {
        public const string SectionName = "Metabase";
        
        /// <summary>
        /// URL base do Metabase (ex: http://192.168.0.10:3000) - Usado para comunica��o interna da API
        /// </summary>
        public string SiteUrl { get; set; } = "";
        
        /// <summary>
        /// URL externa do Metabase (ex: http://&lt;host&gt;:&lt;port&gt;) - Usado para gerar URLs de embedding
        /// </summary>
        public string SiteUrlExternal { get; set; }
        
        /// <summary>
        /// Host do Metabase - alias para SiteUrl para compatibilidade
        /// </summary>
        public string Host => SiteUrl?.TrimEnd('/');
        
        /// <summary>
        /// Host externo - Retorna SiteUrlExternal se configurado, caso contr�rio usa SiteUrl
        /// </summary>
        public string HostExternal => !string.IsNullOrEmpty(SiteUrlExternal) ? SiteUrlExternal.TrimEnd('/') : Host;
        
        /// <summary>
        /// Secret para assinatura de tokens JWT de embedding
        /// </summary>
        public string EmbedSecret { get; set; } = "";
        
        /// <summary>
        /// Tempo de expira��o dos tokens de embedding em minutos
        /// </summary>
        public int EmbedExpMinutes { get; set; } = 10;
        
        /// <summary>
        /// Email do administrador para autentica��o na API
        /// </summary>
        public string AdminEmail { get; set; } = "";
        
        /// <summary>
        /// Senha do administrador para autenticação na API
        /// </summary>
        public string AdminPassword { get; set; } = "";
    }
}