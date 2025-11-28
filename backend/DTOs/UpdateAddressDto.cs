using System.ComponentModel.DataAnnotations;

namespace ShopStore.DTOs;

public class UpdateAddressDto
{
    [Required]
    public string AddressLine { get; set; }

    [Required]
    public string City { get; set; }

    [Required]
    public string Province { get; set; }

    [Required]
    public string PostalCode { get; set; }

    public bool IsDefault { get; set; }
}
