using System;
using System.Collections.Generic;
using MySqlConnector;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Domain.Util.Autentication;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Domain.Service.Generic.Autentication
{
    public class TokenService
    {
        private readonly string _hashCode;
        private readonly string _connectionString;
        private readonly int _timeToken;

        public TokenService(IConfiguration configuration)
        {
            _hashCode = configuration.GetValue<string>("HashCode");
            _timeToken = configuration.GetValue<int>("TimeToken");
            _connectionString = configuration.GetConnectionString("Commerce");
        }

        public (string token, string expireDate) GenerateToken<T>(T param, string timeZoneId = null)
        {
            var key = Encoding.ASCII.GetBytes(_hashCode);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = GenerateClaimsIdentity(param),
                Expires = DateTime.UtcNow.AddHours(_timeToken),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            DateTime expireDate;

            if (!string.IsNullOrWhiteSpace(timeZoneId))
            {
                try
                {
                    var timeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
                    expireDate = TimeZoneInfo.ConvertTimeFromUtc(token.ValidTo, timeZone);
                }
                catch
                {
                    expireDate = token.ValidTo.ToLocalTime();
                }
            }
            else
            {
                expireDate = token.ValidTo.ToLocalTime();
            }

            return (tokenHandler.WriteToken(token), expireDate.ToString("O"));
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_hashCode)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid Token");
            }

            return principal;
        }

        public async Task SaveRefreshTokenAsync(string username, string refreshToken)
        {
            using var connection = new MySqlConnection(_connectionString);
            using var command = new MySqlCommand(GetUpdateRefreshTokenQuery(), connection);
            FillParametersForRefreshToken(command, username, refreshToken);

            await connection.OpenAsync();
            await command.ExecuteNonQueryAsync();
        }

        public async Task<string> GetRefreshTokenAsync(string username)
        {
            using var connection = new MySqlConnection(_connectionString);
            using var command = new MySqlCommand(GetSelectRefreshTokenQuery(), connection);
            command.Parameters.AddWithValue("@username", username ?? (object)DBNull.Value);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();
            return reader.Read() ? reader["token"] as string : null;
        }

        public async Task<User> GetUserAsync(UserLogin userLogin)
        {
            using var connection = new MySqlConnection(_connectionString);
            using var command = new MySqlCommand(GetSelectUserQuery(), connection);
            command.Parameters.AddWithValue("@username", userLogin.Username ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@password", userLogin.Password ?? (object)DBNull.Value);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new User
                {
                    Id = reader["id"] as int?,
                    UserName = reader["username"] as string
                };
            }

            return null;
        }

        private static string GetSelectUserQuery() =>
            "SELECT id, username FROM users WHERE username = @username AND password = @password";

        private static string GetUpdateRefreshTokenQuery() =>
            "UPDATE users SET token = @refreshToken WHERE username = @username";

        private static string GetSelectRefreshTokenQuery() =>
            "SELECT token FROM users WHERE username = @username";

        private static void FillParametersForRefreshToken(MySqlCommand command, string username, string refreshToken)
        {
            command.Parameters.AddWithValue("@username", username ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@refreshToken", refreshToken ?? (object)DBNull.Value);
        }

        private ClaimsIdentity GenerateClaimsIdentity<T>(T parameter)
        {
            if (parameter is User user)
            {
                return new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserName)
                });
            }

            if (parameter is ClaimsPrincipal claimsPrincipal)
            {
                return new ClaimsIdentity(claimsPrincipal.Claims);
            }

            throw new ArgumentException("Invalid parameter for claims generation");
        }
    }
}