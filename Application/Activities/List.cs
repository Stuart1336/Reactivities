using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> 
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //cancellationToken:當Client端停止request，Server端可透過cancellationToken來結束request
                //ProjectTo:利用AutoMapper組態，將Activity資料寫進ActivityDto
                //ProjectTo可避免EF查詢時撈出多餘的欄位
                var query = context.Activities
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, 
                        new {currentUsername = userAccessor.GetUsername()})
                    .AsQueryable(); //AsQueryable尚未開始查詢資料，不可用await

                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(u => u.Username == userAccessor.GetUsername()));
                }

                if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUsername == userAccessor.GetUsername());
                }

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber,
                        request.Params.PageSize)
                );
            }
        }
    }
}