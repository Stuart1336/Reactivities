using System.Text;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection service, 
            IConfiguration config)
            {
                service.AddIdentityCore<AppUser>(opt => {
                    opt.Password.RequireNonAlphanumeric = false;
                })
                .AddEntityFrameworkStores<DataContext>()
                .AddSignInManager<SignInManager<AppUser>>();

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

                service.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(opt => 
                    {
                        opt.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true, //token含有key才能通過驗證
                            IssuerSigningKey = key,
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                    });
                service.AddScoped<TokenService>();

                return service;
            }
    }
}