using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services
        , IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DafaultConnection"));
            });
            services.AddCors(opt =>{
                opt.AddPolicy("CorsPolicy", policy =>
                {  //允許從localhost:3000發起的任何request
                   //回傳Response給localhost:3000時會加上CORS header
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            //告訴mediator handler的所在位置(Assembly)
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            
            //註冊IUserAccessor類型的UserAccessor實作，讓整個專案都能使用UserAccessor
            //IUserAccessor: 注入的類型/ UserAccessor: 實作的類別
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}