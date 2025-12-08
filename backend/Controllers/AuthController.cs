using Microsoft.AspNetCore.Mvc;
using ShopStore.DTOs;
using ShopStore.Models;
using ShopStore.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace ShopStore.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _users;

    public AuthController(IUserRepository users)
    {
        _users = users;
    }

    // ======================== SIGNUP ========================
    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _users.GetByEmailAsync(dto.Email);
        if (existing != null)
            return Conflict(new { message = "Email already exists" });

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = Hash(dto.Password),
            Role = "Customer",
            Status = "Active",
            Phone = "",
            CreatedAt = DateTime.UtcNow,
            LastActivity = DateTime.UtcNow,
            LastLoginAt = DateTime.UtcNow
        };

        await _users.AddUserAsync(user);

        return Ok(new { message = "User registered successfully" });
    }

    // ======================== SIGNIN ========================
    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var user = await _users.GetByEmailAsync(dto.Email);

        if (user == null)
            return Unauthorized("User not found");

        if (user.PasswordHash != Hash(dto.Password))
            return Unauthorized("Invalid password");

        user.LastLoginAt = DateTime.UtcNow;
        user.LastActivity = DateTime.UtcNow;
        await _users.UpdateAsync(user);

        HttpContext.Session.SetString("User", System.Text.Json.JsonSerializer.Serialize(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role
        }));

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role
        });
    }

    // ======================== SIGNOUT ========================
    [HttpPost("signout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok(new { message = "Logged out" });
    }

    // ======================== CURRENT USER ========================
    [HttpGet("current-user")]
    public IActionResult CurrentUser()
    {
        var json = HttpContext.Session.GetString("User");

        if (json == null)
            return Unauthorized();

        return Ok(System.Text.Json.JsonSerializer.Deserialize<object>(json)!);
    }

    // ======================== GET USERS FOR ADMIN ========================
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _users.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _users.GetUserByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(user);
    }

    // ======================== UPDATE PROFILE ========================
    [HttpPut("update-profile/{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _users.GetUserEntityByIdAsync(id);
        if (user == null) return NotFound();

        user.FullName = dto.FullName;
        user.Phone = dto.Phone;

        await _users.UpdateAsync(user);

        return Ok(new { message = "Profile updated" });
    }

    // ======================== PASSWORD HASH ========================
    private string Hash(string text)
    {
        using var sha = SHA256.Create();
        return Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(text)));
    }
}
