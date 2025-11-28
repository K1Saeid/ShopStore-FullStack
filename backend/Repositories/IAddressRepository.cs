using ShopStore.Models;

namespace ShopStore.Repositories
{
    public interface IAddressRepository
    {
        Task<List<UserAddress>> GetByUserIdAsync(int userId);
        Task<UserAddress?> GetByIdAsync(int id);
        Task AddAsync(UserAddress address);
        Task UpdateAsync(UserAddress address);
        Task DeleteAsync(UserAddress address);
    }
}
