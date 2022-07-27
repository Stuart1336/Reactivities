using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration config;
        public TokenService(IConfiguration config)
        {
            this.config = config;
        }

        public string CreateToken(AppUser user)
        {
            //一個使用者的信息片段就是一個Claim(聲明)，
            //所有使用者信息片段合起來就是該用戶的聲明（Claims）
            //Token會包含Claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            //只有單一key可以解鎖SymmetricSecurity，這個key存在server端
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            //使用者登入後，會得到一個驗證token
            return tokenHandler.WriteToken(token);

        }
    }
}