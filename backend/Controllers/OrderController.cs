using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopStore.DTOs;
using ShopStore.Models;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderRepository _orderRepo;
    private readonly ShopContext _context;

    public OrderController(IOrderRepository orderRepo, ShopContext context)
    {
        _orderRepo = orderRepo;
        _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var order = new Order
        {
            UserId = dto.UserId,
            TotalPrice = dto.TotalPrice,
            Status = "Pending",
            OrderNumber = Guid.NewGuid().ToString("N"),
            CreatedAt = DateTime.UtcNow,
        };

        order.Items = dto.Items.Select(i => new OrderItem
        {
            ProductId = i.ProductId,
            Quantity = i.Quantity,
            Size = i.Size,
            Color = i.Color,
            Price = i.Price,
            Order = order
        }).ToList();

        await _orderRepo.CreateOrderAsync(order);

        return Ok(order.Id);
    }



    [HttpGet("details/{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var order = await _orderRepo.GetOrderByIdAsync(id);
        if (order == null) return NotFound();

        var dto = new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            TotalPrice = order.TotalPrice,
            //UserFullName = order.User.FullName,
            User = new UserDto
            {
                Id = order.User.Id,
                FullName = order.User.FullName,
                Email = order.User.Email
            },
            Items = order.Items.Select(i => new OrderItemResponseDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ImageUrl = i.Product.ImageUrl,
                Quantity = i.Quantity,
                Size = i.Size,
                Color = i.Color,
                Price = i.Price
            }).ToList()
        };

        return Ok(dto);
    }
    [HttpGet("by-customer/{userId}")]
    public async Task<IActionResult> GetOrdersByCustomer(int userId)
    {
        var orders = await _orderRepo.GetOrdersByUserAsync(userId);

        if (orders == null || !orders.Any())
            return Ok(new List<OrderResponseDto>()); // برگرداندن لیست خالی

        var dto = orders.Select(order => new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CreatedAt = order.CreatedAt,
            Status = order.Status,
            TotalPrice = order.TotalPrice,
           // UserFullName = order.User.FullName,
            Items = order.Items.Select(i => new OrderItemResponseDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                ImageUrl = i.Product.ImageUrl,
                Quantity = i.Quantity,
                Size = i.Size,
                Color = i.Color,
                Price = i.Price
            }).ToList()
        }).ToList();

        return Ok(dto);
    }
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderRepo.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpPut("update-status/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var order = await _orderRepo.GetOrderByIdAsync(id);
        if (order == null) return NotFound();

        order.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok();
    }


    [HttpGet("sales")]
    public async Task<IActionResult> GetSales([FromQuery] string range = "weekly")
    {
        DateTime start;

        switch (range.ToLower())
        {
            case "yearly":
                start = DateTime.UtcNow.AddYears(-1);
                break;

            case "monthly":
                start = DateTime.UtcNow.AddMonths(-1);
                break;

            case "daily":
                start = DateTime.UtcNow.AddDays(-1);
                break;

            default: // weekly
                start = DateTime.UtcNow.AddDays(-6);
                break;
        }

        var orders = await _context.Orders
            .Where(o => o.CreatedAt >= start)
            .ToListAsync();

        var result = range.ToLower() switch
        {
            "yearly" => orders
                .GroupBy(o => o.CreatedAt.ToString("yyyy-MM"))
                .Select(g => new { label = g.Key, total = g.Sum(x => x.TotalPrice) })
                .OrderBy(x => x.label)
                .ToList(),

            "monthly" => orders
                .GroupBy(o => o.CreatedAt.ToString("yyyy-MM-dd"))
                .Select(g => new { label = g.Key, total = g.Sum(x => x.TotalPrice) })
                .OrderBy(x => x.label)
                .ToList(),

            "daily" => orders
                .GroupBy(o => o.CreatedAt.ToString("HH:00"))
                .Select(g => new { label = g.Key, total = g.Sum(x => x.TotalPrice) })
                .OrderBy(x => x.label)
                .ToList(),

            _ => orders
                .GroupBy(o => o.CreatedAt.ToString("yyyy-MM-dd"))
                .Select(g => new { label = g.Key, total = g.Sum(x => x.TotalPrice) })
                .OrderBy(x => x.label)
                .ToList()
        };

        return Ok(result);
    }


    // today stats 
    [HttpGet("stats/today")]
    public async Task<IActionResult> GetTodayStats()
    {
        var today = DateTime.Today;

        var ordersToday = await _context.Orders
            .Where(o => o.CreatedAt.Date == today)
            .Include(o => o.User)
            .ToListAsync();

        var revenueToday = ordersToday.Sum(o => o.TotalPrice);
        var orderCount = ordersToday.Count;

        var newCustomersToday = await _context.Users
            .Where(u => u.CreatedAt.Date == today)
            .CountAsync();

        var avgOrderValue = orderCount > 0 ? revenueToday / orderCount : 0;

        return Ok(new
        {
            revenueToday,
            orderCount,
            newCustomersToday,
            avgOrderValue
        });
    }

    [HttpGet("stats/status")]
    public async Task<IActionResult> GetOrderStatusStats()
    {
        var totalPaid = await _context.Orders.CountAsync(o => o.Status == "Paid");
        var totalPending = await _context.Orders.CountAsync(o => o.Status == "Pending");
        var totalCancelled = await _context.Orders.CountAsync(o => o.Status == "Cancelled");

        return Ok(new
        {
            paid = totalPaid,
            pending = totalPending,
            cancelled = totalCancelled
        });
    }

}
