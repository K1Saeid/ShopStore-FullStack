using ShopStore.DTOs;

public class OrderResponseDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; }
    public string UserFullName { get; set; }
    public UserDto User { get; set; }
    public List<OrderItemResponseDto> Items { get; set; }
}

public class OrderItemResponseDto
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public string Size { get; set; }
    public string Color { get; set; }
    public decimal Price { get; set; }

    // Product
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string ImageUrl { get; set; }
}
