using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopStore.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Full name is required.")]
        [StringLength(120, ErrorMessage = "Full name must be less than 120 characters.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email.")]
        [StringLength(150)]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Enter a valid phone number.")]
        [StringLength(20)]
        public string? Phone { get; set; }

        [JsonIgnore]
        [Required]
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "Customer"; // Customer, Admin

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Blocked

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? LastLoginAt { get; set; }
        public DateTime LastActivity { get; set; } = DateTime.UtcNow;


        // Navigation
        public List<UserAddress>? Addresses { get; set; }
        public List<Order>? Orders { get; set; }
    }
}
