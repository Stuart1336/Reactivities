using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, 
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new 
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            //Expose Header讓user能看到Header的Pagination內容
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}