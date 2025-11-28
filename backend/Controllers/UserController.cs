using Microsoft.AspNetCore.Mvc;
using ShopStore.Repositories;

namespace ShopStore.Controllers;
public class UserController : Controller
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    [HttpPost("update-activity/{userId}")]
    public async Task<IActionResult> UpdateActivity(int userId)
    {
        await _userRepository.UpdateActivityAsync(userId);
        return Ok();
    }

    [HttpGet("active-users")]
    public async Task<IActionResult> GetActiveUsers()
    {
        var count = await _userRepository.GetActiveUsersCountAsync();
        return Ok(count);
    }


}
