using Microsoft.AspNetCore.Mvc;
using ShopStore.DTOs;
using ShopStore.Models;

namespace ShopStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepo;
        private readonly ShopContext _context;

        public CartController(ICartRepository cartRepo, ShopContext context)
        {
            _cartRepo = cartRepo;
            _context = context;
        }

        // GET api/cart/5
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _cartRepo.GetCart(userId);
            return Ok(cart);
        }

        // POST api/cart/add
        [HttpPost("add")]

        public async Task<IActionResult> AddToCart([FromBody] CartAddDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = new CartItem
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                Size = dto.Size,
                Color = dto.Color,
                Price = dto.Price,
                CartId = 0
            };

            await _cartRepo.AddItem(dto.UserId, item);
            
            var updatedCart = await _cartRepo.GetCart(dto.UserId);


            return Ok(new
            {
                success = true,
                cartItemsCount = updatedCart.Items.Sum(x => x.Quantity) 
            });
        }


        // PUT api/cart/update-qty/10/3
        [HttpPut("update-qty/{itemId}/{qty}")]
        public async Task<IActionResult> UpdateQty(int itemId, int qty)
        {
            if (qty < 1)
                return BadRequest("Qty cannot be less than 1");

            await _cartRepo.UpdateQuantity(itemId, qty);
            return Ok(new { message = "Quantity updated" });
        }

        // DELETE api/cart/item/10
        [HttpDelete("item/{itemId}")]
        public async Task<IActionResult> RemoveItem(int itemId)
        {
            await _cartRepo.RemoveItem(itemId);
            return Ok(new { message = "Item removed" });
        }

        // DELETE api/cart/clear/5
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            await _cartRepo.ClearCart(userId);
            return Ok(new { message = "Cart cleared" });
        }
    }
}
