using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext,
            IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            //NameIdentifier: 取得user的識別碼
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(httpContextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = dbContext.ActivityAttendees
                .AsNoTracking() //不將attendee資料保存在記憶體中
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
                .Result;

            if (attendee == null) return Task.CompletedTask;
            //當attendee是該活動的主持人時，才給予授權(requirement)
            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
    
}