namespace Api.Options
{
    /// <summary>
    /// Valores padrão para configuração do Metabase
    /// </summary>
    public static class MetabaseDefaults
    {
        /// <summary>URL padrão do Metabase</summary>
        public const string SiteUrl = "http://192.168.0.11:8080";
        
        /// <summary>Chave secreta padrão para embedding</summary>
        public const string EmbedSecret = "1392b08f27c85dc0a9855a4135cfcaf64f871fb47c3a3ece4648b1c88cabc31f";
        
        /// <summary>Tempo padrão de expiração dos tokens em minutos</summary>
        public const int EmbedExpMinutes = 10;
        
        /// <summary>Email padrão do administrador</summary>
        public const string AdminEmail = "higor@mbasistemas.com";
        
        /// <summary>Senha padrão do administrador</summary>
        public const string AdminPassword = "6plBuGKjzzqymp";
    }
}