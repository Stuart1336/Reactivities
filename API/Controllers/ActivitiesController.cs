using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery]ActivityParams param)
        {
            //傳送request(List.Query給handler)
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
        }

        [HttpGet("{id}")] //輸入Activities的id可以搜尋特定Activity
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //將判斷Request的邏輯放到BaseApiController
            return HandleResult<ActivityDto>(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            //ApiController父類別，自己會在Request找Activity object
            //IActionResult可以return Ok. BadRequest. Not Found等Http response
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendence.Command{Id = id}));
        }
    }

}