using System.Security.Claims;
using System.Threading.Tasks;
using Domain.Util.Autentication;

namespace Commerce.Application.Interfaces
{
    /// <summary>
    /// Contrato para autenticação: geração de tokens JWT, refresh tokens e validação de usuário.
    /// </summary>
    public interface ITokenService
    {
        Task<User> GetUserAsync(UserLogin userLogin);

        (string token, string expireDate) GenerateToken<T>(T param, string timeZoneId = null);

        string GenerateRefreshToken();

        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);

        Task SaveRefreshTokenAsync(string username, string refreshToken);

        Task<string> GetRefreshTokenAsync(string username);
    }
}
