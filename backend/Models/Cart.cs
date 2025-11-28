using ShopStore.Models;
using System.ComponentModel.DataAnnotations;

public class Cart
{
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    public User User { get; set; }

    public List<CartItem> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
}
