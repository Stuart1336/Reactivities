using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        //jwt token放在http response header中
        //先取得HttpContext，才能取得jwt token
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public string GetUsername()
        {
            //取得Token當中的Username訊息
            return httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}