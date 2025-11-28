using System.ComponentModel.DataAnnotations;

namespace ShopStore.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [Required]
        public int ProductId { get; set; }
        public Product Product { get; set; }

        [Required]
        [Range(1, 999)]
        public int Quantity { get; set; }
        [Required]
        public string Size { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        [Range(1, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
