using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            //GetCurrentDirectory: 取得目前的跟目錄路徑(localhost:5000/api or /api)
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot", "index.html"), "text/HTML");
        }
    }
}