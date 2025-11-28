using System.ComponentModel.DataAnnotations;

namespace ShopStore.DTOs;

public class UpdateUserDto
{
    [Required]
    [StringLength(120)]
    public string FullName { get; set; }

    [Phone]
    [StringLength(20)]
    public string? Phone { get; set; }
}
