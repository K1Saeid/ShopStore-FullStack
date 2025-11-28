using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;

using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.AspNetCore.Builder;





var builder = WebApplication.CreateBuilder(args);




// Add services to the container.
builder.Services.AddDbContext<ShopContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ShopDb")));


builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


builder.Services.AddCors(options =>
{
    
    options.AddPolicy("AllowAngular",
        policy => policy
            .WithOrigins("http://localhost:4200") //  Angular Address
             .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});




builder.Services.AddAuthorization(); // Roles, Policies
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();


app.UseCors("AllowAngular");

// Image upload static files
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // JSON
    
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "ShopStore API V1");
    });


}
app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseStaticFiles();

app.UseSession();

app.MapControllers();

app.Run();


//{
//    "name": "Nike Air Max 1",
//  "description": "Nike rare Preowned Air Max 1 Just Do It Pack White.",
//  "brand": "NIKE",
//  "gender": "MEN",
//  "category": "RUNNING",
//  "sizes": "40,41,42,43,44",
//  "colors": "White,Black,Red",
//  "price": 190,
//  "discountPrice": 160,
//  "inStock": true,
//  "itemsLeft": 5,
//  "imageUrl": "https://di2ponv0v5otw.cloudfront.net/posts/2025/01/17/678abac36ccbb68b575d68be/m_678ac015d399fff0860c8e89.jpg",
//  "slug": "nike-air-max-1"
//}
