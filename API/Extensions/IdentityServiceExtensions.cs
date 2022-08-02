using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using static Infrastructure.Security.IsHostRequirement;

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
                        opt.Events = new JwtBearerEvents
                        {
                            //當使用者連線上SignalR Hub
                            //(SignalR發request時沒辦法帶header藏token) ==> 透過queryString傳token(做身分驗證)
                            OnMessageReceived = context =>
                            {
                                //透過queryString取得jwt token
                                var accessToken = context.Request.Query["access_token"];
                                var path = context.HttpContext.Request.Path;
                                if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                                {
                                    context.Token = accessToken;
                                }

                                return Task.CompletedTask;
                            }
                        };
                    });
                service.AddAuthorization(opt => {
                    opt.AddPolicy("IsActivityHost", policy => {
                        policy.Requirements.Add(new IsHostRequirement());
                    });
                });
                service.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
                service.AddScoped<TokenService>();

                return service;
            }
    }
}