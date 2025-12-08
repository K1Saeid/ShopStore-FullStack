using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopStore.DTOs;
using ShopStore.Models;
using ShopStore.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace ShopStore.Controllers;
[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public AuthController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Email already exists?
        var existingUser = await _userRepository.GetByEmailAsync(model.Email);
        if (existingUser != null)
            return Conflict(new { message = "Email already exists" }); // <-- 409 Conflict

        var user = new User
        {
            FullName = model.FullName,
            Email = model.Email,
            PasswordHash = HashPassword(model.Password),
            Role = "Customer",
            Status = "Active",
            CreatedAt = DateTime.UtcNow,

            Phone = "",
            LastLoginAt = DateTime.UtcNow,
            LastActivity = DateTime.UtcNow
        };

        await _userRepository.AddUserAsync(user);

        return Ok(new { message = "User registered successfully" });
    }




    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto login)
    {
        var user = await _userRepository.GetByEmailAsync(login.Email);
        
        if (user == null)
            return Unauthorized("User not found");
        user.LastActivity = DateTime.Now;
        if (user.PasswordHash != HashPassword(login.Password))

            return Unauthorized("Invalid password");

        HttpContext.Session.SetString("User", System.Text.Json.JsonSerializer.Serialize(new
        {
            user.Id,
            user.FullName,
            user.Email
        }));

        return Ok(new { user.Id, user.FullName, user.Email });
    }



    [HttpPost("signout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Signed out successfully" });
    }

    private string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
    [HttpGet("current-user")]
    public IActionResult GetCurrentUser()
    {
        // خواندن داده‌ی کاربر از سشن
        var userJson = HttpContext.Session.GetString("User");

        if (userJson == null)
            return Unauthorized("No user is currently logged in.");

        // تبدیل JSON به شیء User
        var user = System.Text.Json.JsonSerializer.Deserialize<User>(userJson);

        return Ok(user);
    }

    // GET: api/auth/users

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return Ok(users);
    }
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UserDto dto)
    {
        var user = await _userRepository.GetUserEntityByIdAsync(id);
        if (user == null) return NotFound();

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Phone = dto.Phone;
        user.Role = dto.Role;
        user.Status = dto.Status;

        await _userRepository.UpdateAsync(user);

        return Ok();
    }
    [HttpPut("block/{id}")]
    public async Task<IActionResult> BlockUser(int id)
    {
        await _userRepository.BlockUserAsync(id);
        return Ok(new { message = "User Blocked" });
    }

    [HttpPut("update-profile/{id}")]
    public async Task<IActionResult> UpdateProfile(int id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetUserEntityByIdAsync(id);
        if (user == null)
            return NotFound();

        user.FullName = dto.FullName;
        user.Phone = dto.Phone;

        await _userRepository.UpdateAsync(user);
        return Ok(new { message = "Profile updated successfully" });
    }

}
