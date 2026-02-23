using System.Security.Claims;
using System.Threading.Tasks;
using Commerce.Application.Interfaces;
using Domain.Service.Generic.Autentication;
using Domain.Util.Autentication;
using Microsoft.Extensions.Configuration;

namespace Commerce.Infrastructure.Services.Auth
{
    /// <summary>
    /// Adaptador que expõe TokenService do Domain como ITokenService injetável via DI.
    /// </summary>
    public class TokenServiceAdapter : ITokenService
    {
        private readonly TokenService _inner;

        public TokenServiceAdapter(IConfiguration configuration)
        {
            _inner = new TokenService(configuration);
        }

        public Task<User> GetUserAsync(UserLogin userLogin)
            => _inner.GetUserAsync(userLogin);

        public (string token, string expireDate) GenerateToken<T>(T param, string timeZoneId = null)
            => _inner.GenerateToken(param, timeZoneId);

        public string GenerateRefreshToken()
            => _inner.GenerateRefreshToken();

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
            => _inner.GetPrincipalFromExpiredToken(token);

        public Task SaveRefreshTokenAsync(string username, string refreshToken)
            => _inner.SaveRefreshTokenAsync(username, refreshToken);

        public Task<string> GetRefreshTokenAsync(string username)
            => _inner.GetRefreshTokenAsync(username);
    }
}
