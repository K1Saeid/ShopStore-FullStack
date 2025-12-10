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

        public UploadController()
        {
            // ❗ این سه مقدار رو با مقادیر واقعی Cloudinary Dashboardت جایگزین کن
            var cloudName = "dejw8negd";
            var apiKey = "728653948576733";
            var apiSecret = "aKK2ODSG_rf-_cYYNhpnd61mlYg";

            _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    Folder = "shopstore/products"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    // خطای Cloudinary
                    return StatusCode(500, uploadResult.Error.Message);
                }

                return Ok(new { imageUrl = uploadResult.SecureUrl.ToString() });
            }
            catch (Exception ex)
            {
                // برای لاگ
                Console.WriteLine("Upload error: " + ex.Message);
                return StatusCode(500, "Upload failed");
            }
        }
    }
}
