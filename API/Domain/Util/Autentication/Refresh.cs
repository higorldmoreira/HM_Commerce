namespace Domain.Util.Autentication
{
    public class Refresh
    {
        /// <summary>Token do usuario</summary>
        public string Token { get; set; }
        /// <summary>Token para realizar o refresh</summary>
        public string RefreshToken { get; set; }
    }
}