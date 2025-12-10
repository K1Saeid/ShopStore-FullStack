using Microsoft.EntityFrameworkCore;
using ShopStore.DTOs;
using ShopStore.Models;

public class OrderRepository : IOrderRepository
{
    private readonly ShopContext _context;

    public OrderRepository(ShopContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<List<Order>> GetOrdersByUserAsync(int userId)
    {
        return await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)    
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
    public async Task<List<OrderResponseDto>> GetAllOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                Status = o.Status,

                // 👇 اطلاعات کامل مشتری
                UserFullName = o.User.FullName,
                User = new UserDto
                {
                    Id = o.User.Id,
                    FullName = o.User.FullName,
                    Email = o.User.Email,
                    Phone = o.User.Phone,
                    Role = o.User.Role,
                    Status = o.User.Status,
                    CreatedAt = o.User.CreatedAt,
                    LastLoginAt = o.User.LastLoginAt
                },

                // 👇 اطلاعات هر آیتم سفارش
                Items = o.Items.Select(i => new OrderItemResponseDto
                {
                    Id = i.Id,
                    Quantity = i.Quantity,
                    Size = i.Size,
                    Color = i.Color,
                    Price = i.Price,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    ImageUrl = i.Product.ImageUrl
                }).ToList()
            })
            .ToListAsync();
    }


    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        return await _context.Orders
             .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }
}
