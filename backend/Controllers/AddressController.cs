using Microsoft.AspNetCore.Mvc;
using ShopStore.DTOs;
using ShopStore.Models;
using ShopStore.Repositories;
using System.Text.Json;
namespace ShopStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AddressController : ControllerBase
{
    private readonly IAddressRepository _repo;

    public AddressController(IAddressRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAll(int userId)
    {
        return Ok(await _repo.GetByUserIdAsync(userId));
    }

    
    [HttpPost("{userId}")]
    public async Task<IActionResult> Add(int userId, UpdateAddressDto dto)
    {
        var address = new UserAddress
        {
            UserId = userId,
            AddressLine = dto.AddressLine,
            City = dto.City,
            Province = dto.Province,
            PostalCode = dto.PostalCode,
            IsDefault = dto.IsDefault
        };

        await _repo.AddAsync(address);

        return Ok(address);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAddressDto dto)
    {
        var address = await _repo.GetByIdAsync(id);
        if (address == null) return NotFound();

        address.AddressLine = dto.AddressLine;
        address.City = dto.City;
        address.Province = dto.Province;
        address.PostalCode = dto.PostalCode;
        address.IsDefault = dto.IsDefault;

        await _repo.UpdateAsync(address);
        return Ok(address);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var address = await _repo.GetByIdAsync(id);
        if (address == null) return NotFound();

        await _repo.DeleteAsync(address);
        return Ok();
    }
}
