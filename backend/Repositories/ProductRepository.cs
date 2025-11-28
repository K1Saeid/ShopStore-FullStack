using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using System.Text.Json;

namespace ShopStore.Repositories;

public class ProductRepository(ShopContext context , IHttpContextAccessor httpContextAccessor) : IProductRepository
{
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;
    private readonly ShopContext context = context;

    public string? GetCurrentUserEmail()
    {
        var userJson = httpContextAccessor.HttpContext?.Session.GetString("User");
        if (userJson == null) return null;
        var user = JsonSerializer.Deserialize<User>(userJson);
        return user?.Email;
    }

    public async Task<List<Product>> GetAllAsync() =>
        await context.Products.Include(p => p.Category).AsNoTracking().ToListAsync();

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products.Include(p => p.Category) // ⭐ JOIN
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task AddAsync(Product product)
    {
        await context.Products.AddAsync(product);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        context.Products.Update(product);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Product product)
    {
        context.Products.Remove(product);
        await context.SaveChangesAsync();
    }
}