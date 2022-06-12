using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command> //Command不會回傳資料
        {
            private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {   //AddAsync是使用非同步方法"對資料庫進行操作"，這邊資料只是暫存在記憶體
                //尚未存進資料庫，所以不需使用AddAsync
                context.Activities.Add(request.Activity);

                //存進資料庫才需要用非同步方法
                await context.SaveChangesAsync();

                return Unit.Value; //return nothing，只是告訴API，function已經結束
            }
        }
    }
}