using ShopStore.Models;

public interface ICartRepository
{
    Task<Cart> GetCart(int userId);
    Task AddItem(int userId, CartItem item);
    Task UpdateQuantity(int itemId, int quantity);
    Task RemoveItem(int itemId);
    Task ClearCart(int userId);
}
