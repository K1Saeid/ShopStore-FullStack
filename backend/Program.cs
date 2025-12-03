using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.AspNetCore.Builder;


var builder = WebApplication.CreateBuilder(args);
// ------------------- CORS --------------------


// ------------------- ADD HTTP CONTEXT --------------------
builder.Services.AddHttpContextAccessor();  // <--- اضافه کن

// ------------------- CONTROLLERS --------------------
builder.Services.AddControllers();

// ------------------- PORT FOR RAILWAY --------------------
var port = Environment.GetEnvironmentVariable("PORT");

if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddAuthorization(); // Roles, Policies
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ------------------- DATABASE --------------------
builder.Services.AddDbContext<ShopContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ------------------- REPOSITORIES --------------------
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// ------------------- CORS --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ------------------- CONTROLLERS --------------------
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ------------------- PORT BINDING --------------------


// ------------------- SWAGGER ALWAYS ON --------------------
app.MapOpenApi();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "ShopStore API V1");
    options.RoutePrefix = "swagger";
});

// ------------------- PIPELINE --------------------
app.UseCors("AllowAll");
app.UseStaticFiles();
app.UseSession();
app.MapControllers();

app.Run();
