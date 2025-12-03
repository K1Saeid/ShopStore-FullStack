namespace ShopStore.DTOs
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public string Gender { get; set; }
        public string Sizes { get; set; }
        public string Colors { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public bool InStock { get; set; }
        public int ItemsLeft { get; set; }
        public string ImageUrl { get; set; }
        public string Slug { get; set; }
        public int CategoryId { get; set; }
    }
}
