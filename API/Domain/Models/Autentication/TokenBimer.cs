
namespace Domain.Models.Autentication
{
    public class TokenBimer
    {
        public TokenBimer()
        {
            
        }

        public string client_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string grant_type { get; set; }
        public string nonce { get; set; }
    }
}