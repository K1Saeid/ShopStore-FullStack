using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopStore.Models;

public class Category
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    // Navigation property for related products (if needed)
    [JsonIgnore]
    public List<Product> Products { get; set; } = new List<Product>();
}
