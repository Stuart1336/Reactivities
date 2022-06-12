using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        
        //protected: 只有BaseApi和繼承BaseApi的類別可以存取這個屬性
        //??: 若_mediator是null則將HttpContext...指派給Mediator
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices
            .GetService<IMediator>();
    }
}