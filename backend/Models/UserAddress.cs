using System.ComponentModel.DataAnnotations;

namespace ShopStore.Models
{
    public class UserAddress
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }

        [Required(ErrorMessage = "Address line is required.")]
        [StringLength(200)]
        public string AddressLine { get; set; }

        [Required]
        [StringLength(60)]
        public string City { get; set; }

        [Required]
        [StringLength(60)]
        public string Province { get; set; }

        [Required]
        [StringLength(15)]
        public string PostalCode { get; set; }

        public bool IsDefault { get; set; } = false;
    }
}
