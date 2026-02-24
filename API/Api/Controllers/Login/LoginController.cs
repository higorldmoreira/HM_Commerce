using Commerce.Application.Interfaces;
using Domain.Util.Autentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers.Login
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = false)]
    public class LoginController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        public LoginController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        /// <summary>
        /// Realiza o login do usuário e gera o token de acesso.
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> LoginAsync([FromBody] UserLogin userLogin)
        {
            var user = await _tokenService.GetUserAsync(userLogin);

            if (user == null)
                return NotFound(new { message = "Usuário não encontrado." });

            var (token, expireDate) = _tokenService.GenerateToken(user, userLogin.TimeZoneId);
            var refreshToken = _tokenService.GenerateRefreshToken();
            await _tokenService.SaveRefreshTokenAsync(user.UserName, refreshToken);

            return Ok(new
            {
                user,
                token,
                refreshToken,
                expireDate
            });
        }

        /// <summary>
        /// Gera novo token de acesso com base no refresh token.
        /// </summary>
        [HttpPost("Refresh")]
        [Authorize]
        public async Task<ActionResult<dynamic>> RefreshAsync([FromBody] Refresh refresh)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(refresh.Token);
            var username = principal.Identity?.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Token inválido." });

            var savedRefreshToken = await _tokenService.GetRefreshTokenAsync(username);

            if (savedRefreshToken != refresh.RefreshToken)
                return Forbid("Refresh token inválido.");

            var (newToken, expireDate) = _tokenService.GenerateToken(principal);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            await _tokenService.SaveRefreshTokenAsync(username, newRefreshToken);

            return Ok(new
            {
                token = newToken,
                refreshToken = newRefreshToken,
                expireDate
            });
        }
    }
}
