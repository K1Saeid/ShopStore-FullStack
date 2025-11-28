using System.ComponentModel.DataAnnotations;

namespace ShopStore.Models
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        [StringLength(40)]
        public string OrderNumber { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        [Range(1, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Paid, Shipped, Delivered, Canceled

        // Navigation
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
