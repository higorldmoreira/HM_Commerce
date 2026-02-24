namespace Api.Options
{
    /// <summary>
    /// Valores padr�o para configura��o do Metabase
    /// </summary>
    public static class MetabaseDefaults
    {
        /// <summary>URL padr�o do Metabase</summary>
        public const string SiteUrl = "";
        
        /// <summary>Chave secreta padrão para embedding</summary>
        public const string EmbedSecret = "";
        
        /// <summary>Tempo padrão de expiração dos tokens em minutos</summary>
        public const int EmbedExpMinutes = 10;
        
        /// <summary>Email padrão do administrador</summary>
        public const string AdminEmail = "";
        
        /// <summary>Senha padrão do administrador</summary>
        public const string AdminPassword = "";
    }
}