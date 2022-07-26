using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            //傳送request(List.Query給handler)
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")] //輸入Activities的id可以搜尋特定Activity
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //將判斷Request的邏輯放到BaseApiController
            return HandleResult<Activity>(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            //ApiController父類別，自己會在Request找Activity object
            //IActionResult可以return Ok. BadRequest. Not Found等Http response
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }

}