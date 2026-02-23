namespace Domain.Util.Autentication
{
    public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }

        // Novo campo para fuso horário
        public string TimeZoneId { get; set; } = null;
    }
}
