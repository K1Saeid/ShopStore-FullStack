using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace ShopStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly Cloudinary _cloudinary;

        public UploadController(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "shopstore/products"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            return Ok(new { imageUrl = uploadResult.SecureUrl.ToString() });
        }
    }
}
