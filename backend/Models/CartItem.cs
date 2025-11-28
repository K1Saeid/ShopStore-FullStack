using ShopStore.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class CartItem
{
    public int Id { get; set; }

    [Required]
    public int CartId { get; set; }
    [JsonIgnore]
    public Cart Cart { get; set; }


    [Required]
    public int ProductId { get; set; }
    public Product Product { get; set; }

    [Required]
    [Range(1, 999)]
    public int Quantity { get; set; }
    [Required]
    [StringLength(10)]
    public string Size { get; set; }
    [Required]
    [StringLength(20)]
    public string Color { get; set; }
    [Required]
    [Range(1, double.MaxValue)]
    public decimal Price { get; set; }  // Price at the time of adding to cart
}
