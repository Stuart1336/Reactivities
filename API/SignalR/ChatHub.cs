using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator mediator;
        public ChatHub(IMediator mediator)
        {
            this.mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            //取得新上傳comment
            var comment = await mediator.Send(command);

            //通知有參與該activity的client
            //ReceiveComment: Client端可透過這個名稱，取得新增的comment
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            //從HttpRequest當中取得ActivityId
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            //將連線的Client加入其參與的活動Group中
            //當Client斷線時，SignalR會自動將Client從group當中移除
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            //取得連線者有參與的活動的comment
            var result = await mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});

            //將撈出的comment給Caller(連線者)
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}