using Microsoft.AspNetCore.Mvc;
using ShopStore.Models;
using ShopStore.Repositories;

namespace ShopStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repo;

        public CategoryController(ICategoryRepository repo)
        {
            _repo = repo;
        }

        // GET: api/category
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var categories = await _repo.GetAllAsync();
            return Ok(categories);
        }

        // GET: api/category/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var category = await _repo.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        // POST: api/category
        [HttpPost]
        public async Task<ActionResult> Create(Category category)
        {
            category.Slug = category.Name.ToLower().Replace(" ", "-");
            await _repo.AddAsync(category);

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        // PUT: api/category/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Category category)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            // Update fields
            existing.Name = category.Name;
            existing.Description = category.Description;
            existing.Slug = category.Name.ToLower().Replace(" ", "-");
            

            await _repo.UpdateAsync(existing);

            return Ok(existing);
        }


        // DELETE: api/category/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _repo.DeleteAsync(existing);
            return Ok();
        }
    }
}
