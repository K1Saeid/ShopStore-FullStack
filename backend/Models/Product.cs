using System.ComponentModel.DataAnnotations;

namespace ShopStore.Models;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Brand { get; set; } = string.Empty;

    public string Gender { get; set; } = "UNISEX";

    public string Sizes { get; set; } = string.Empty;   // "6,7,8,9,10"
    public string Colors { get; set; } = string.Empty;  // "White,Blue,Black"

    [Range(0, 10000)]
    public decimal Price { get; set; }

    public decimal? DiscountPrice { get; set; }

    public bool InStock { get; set; }

    public int ItemsLeft { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    // Foreign key to Category
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}

