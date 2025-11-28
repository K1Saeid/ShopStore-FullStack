using ShopStore.DTOs;
using ShopStore.Models;

namespace ShopStore.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddUserAsync(User user);
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
    Task UpdateAsync(User user);
    Task BlockUserAsync(int id);

    Task<User> GetUserEntityByIdAsync(int id);
    Task UpdateActivityAsync(int userId);
    Task<int> GetActiveUsersCountAsync();


}
