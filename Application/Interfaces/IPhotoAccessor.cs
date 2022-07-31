using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        //IFormFile: 透過Http協定傳送的file，裡面有我們需要的file屬性
         Task<PhotoUploadResult> AddPhoto(IFormFile file);

         Task<string> DeletePhoto(string publicId);
    }
}