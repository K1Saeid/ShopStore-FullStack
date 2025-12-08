using Microsoft.AspNetCore.Mvc;
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

    // ==============================
    // REGISTER
    // ==============================

    [HttpPost("signup")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userRepository.GetByEmailAsync(model.Email);
        if (existingUser != null)
            return Conflict(new { message = "Email already exists" });

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

    // ==============================
    // LOGIN
    // ==============================

    [HttpPost("signin")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto login)
    {
        var user = await _userRepository.GetByEmailAsync(login.Email);

        if (user == null)
            return Unauthorized("User not found");

        if (user.PasswordHash != HashPassword(login.Password))
            return Unauthorized("Invalid password");

        var sessionUser = new CurrentUserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };

        HttpContext.Session.SetString("User",
            System.Text.Json.JsonSerializer.Serialize(sessionUser));

        return Ok(sessionUser);
    }

    // ==============================
    // LOGOUT
    // ==============================

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Remove("User");
        return Ok(new { message = "Signed out successfully" });
    }

    // ==============================
    // CURRENT USER
    // ==============================

    [HttpGet("current-user")]
    public IActionResult GetCurrentUser()
    {
        var json = HttpContext.Session.GetString("User");

        if (json == null)
            return Unauthorized(new { message = "No user logged in" });

        var user = System.Text.Json.JsonSerializer.Deserialize<CurrentUserDto>(json);

        return Ok(user);
    }

    private string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
