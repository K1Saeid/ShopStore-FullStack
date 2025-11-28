public class CreateOrderDto
{
    public int UserId { get; set; }
    public decimal TotalPrice { get; set; }
    public List<CreateOrderItemDto> Items { get; set; }
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string Size { get; set; }
    public string Color { get; set; }
    public decimal Price { get; set; }
}
