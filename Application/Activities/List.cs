using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.Extensions.Logging;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //cancellationToken:當Client端停止request，Server端可透過cancellationToken來結束request
                //ProjectTo:利用AutoMapper組態，將Activity資料寫進ActivityDto
                //ProjectTo可避免EF查詢時撈出多餘的欄位
                var activities = await context.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}