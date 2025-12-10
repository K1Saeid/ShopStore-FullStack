using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;

var builder = WebApplication.CreateBuilder(args);

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
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "https://k1saeid.github.io",
            "https://k1saeid.github.io/ShopStore-FullStack"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddSession();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// ------------------- LOAD CLOUDINARY HERE (NOT BEFORE BUILD) --------------------
var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

Console.WriteLine($"Cloud: {cloudName}, Key: {apiKey}"); // Debug

app.Services.GetRequiredService<IServiceCollection>()
    .AddSingleton(new Cloudinary(new Account(cloudName, apiKey, apiSecret)));


// ------------------- MIDDLEWARE --------------------
app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.UseAuthorization();

app.MapControllers();

app.Run();
