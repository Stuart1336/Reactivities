using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;
        private readonly IHostEnvironment env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, 
            IHostEnvironment env)
        {
            this.env = env;
            this.logger = logger;
            this.next = next;
            
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //當HttpRequest向下傳遞時
                await next(context);
            }
            catch(Exception ex)
            {
                //若發生exception則會被接住
                logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application.json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //將Exception轉成500系列錯誤

                var response = env.IsDevelopment() 
                ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new AppException(context.Response.StatusCode, "Server Error");

                //確保回傳的Json是CamelCase
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}