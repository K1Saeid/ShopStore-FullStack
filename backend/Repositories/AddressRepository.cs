using Microsoft.EntityFrameworkCore;
using ShopStore.Models;

namespace ShopStore.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly ShopContext _context;

        public AddressRepository(ShopContext context)
        {
            _context = context;
        }

        public async Task<List<UserAddress>> GetByUserIdAsync(int userId)
        {
            return await _context.UserAddresses
                .Where(a => a.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<UserAddress?> GetByIdAsync(int id)
        {
            return await _context.UserAddresses.FindAsync(id);
        }

        public async Task AddAsync(UserAddress address)
        {
            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserAddress address)
        {
            _context.UserAddresses.Update(address);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(UserAddress address)
        {
            _context.UserAddresses.Remove(address);
            await _context.SaveChangesAsync();
        }
    }
}
