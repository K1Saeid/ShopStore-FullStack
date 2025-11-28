using Microsoft.EntityFrameworkCore;
using ShopStore.Models;

public class CartRepository : ICartRepository
{
    private readonly ShopContext _context;

    public CartRepository(ShopContext context)
    {
        _context = context;
    }

    public async Task<Cart> GetCart(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                Items = new List<CartItem>()   // مهم!!!
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        // اگر Items از دیتابیس NULL بیاد → ست کن
        if (cart.Items == null)
            cart.Items = new List<CartItem>();

        cart.TotalPrice = cart.Items.Sum(i => i.Price * i.Quantity);

        return cart;
    }


    public async Task AddItem(int userId, CartItem item)
    {
        var cart = await GetCart(userId);

        var existingItem = cart.Items
            .FirstOrDefault(ci =>
                ci.ProductId == item.ProductId &&
                ci.Size == item.Size &&
                ci.Color == item.Color);

        if (existingItem != null)
        {
            existingItem.Quantity += item.Quantity;
        }
        else
        {
            item.CartId = cart.Id;
            cart.Items.Add(item);
        }

        cart.TotalPrice = cart.Items.Sum(i => i.Price * i.Quantity);

        await _context.SaveChangesAsync();
    }

    public async Task UpdateQuantity(int itemId, int quantity)
    {
        var item = await _context.CartItems.FindAsync(itemId);

        if (item != null)
        {
            item.Quantity = quantity;
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveItem(int itemId)
    {
        var item = await _context.CartItems.FindAsync(itemId);

        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearCart(int userId)
    {
        var cart = await GetCart(userId);

        _context.CartItems.RemoveRange(cart.Items);
        cart.Items.Clear();
        cart.TotalPrice = 0;

        await _context.SaveChangesAsync();
    }
}
