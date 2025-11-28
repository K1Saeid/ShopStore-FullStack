using Microsoft.AspNetCore.Mvc;
using ShopStore.Repositories;
using ShopStore.Models;
using Microsoft.AspNetCore.Authorization;


namespace ShopStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(IProductRepository repository , ICategoryRepository category) : ControllerBase
{
    private readonly IProductRepository _repository = repository;
    private readonly ICategoryRepository _category = category;
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var products = await repository.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return NotFound();

        return Ok(product);
    }
    [HttpPost]
    public async Task<ActionResult> Post(Product product)
    {
        await _repository.AddAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
  
    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, Product product)
    {
        product.Id = id;
        await _repository.UpdateAsync(product);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repository.DeleteAsync(existing);
        return Ok();
    }
}
