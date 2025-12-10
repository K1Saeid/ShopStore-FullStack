using ShopStore.Models;

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
    Task<List<Order>> GetOrdersByUserAsync(int userId);
    Task<List<OrderResponseDto>> GetAllOrdersAsync();
    Task<Order> GetOrderByIdAsync(int id);

}
