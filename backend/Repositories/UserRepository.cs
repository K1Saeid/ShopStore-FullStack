using Microsoft.EntityFrameworkCore;
using ShopStore.DTOs;
using ShopStore.Models;

namespace ShopStore.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ShopContext _context;

    public UserRepository(ShopContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddUserAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    
    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role,
                Status = u.Status,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt,
                LastActivity = u.LastActivity
            })
            .ToListAsync();
    }
    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role,
                Status = u.Status,
                CreatedAt = u.CreatedAt,
                LastLoginAt = u.LastLoginAt,
                LastActivity = u.LastActivity
            })
            .FirstOrDefaultAsync();
    }
    public async Task<User> GetUserEntityByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Addresses)
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    public async Task BlockUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            user.Status = "Blocked";
            await _context.SaveChangesAsync();
        }
    }
    public async Task<int> GetActiveUsersCountAsync()
    {
        var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);

        return await _context.Users
            .CountAsync(u => u.LastActivity >= fiveMinutesAgo);
    }

    public async Task UpdateActivityAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return;

        user.LastActivity = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }


}


