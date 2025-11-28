using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.PixelFormats;
using ImageMagick;

namespace ShopStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadPath = Path.Combine("wwwroot", "images");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            var finalName = $"{Guid.NewGuid()}.jpg";
            var finalPath = Path.Combine(uploadPath, finalName);

            using (var stream = file.OpenReadStream())
            using (var image = new MagickImage(stream))
            {
                image.Format = MagickFormat.Jpeg;   // تبدیل AVIF → JPG
                image.Quality = 90;
                await image.WriteAsync(finalPath);
            }

            var url = $"{Request.Scheme}://{Request.Host}/images/{finalName}";
            return Ok(new { imageUrl = url });
        }
    }
}
