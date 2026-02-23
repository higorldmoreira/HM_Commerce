
namespace Domain.Models.Autentication
{
    public class TokenBimerResult
    {
        public TokenBimerResult()
        {
            
        }

        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string refresh_token { get; set; }
    }
}