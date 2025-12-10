using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;

var builder = WebApplication.CreateBuilder(args);

var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME");
var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY");
var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET");

builder.Services.AddSingleton(new Cloudinary(new Account(
    cloudName,
    apiKey,
    apiSecret
)));



// ------------------- PORT FOR RAILWAY --------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

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
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAngular", policy =>
//        policy.WithOrigins("http://localhost:4200")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials());
//});
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

// ------------------- JSON + HTTP CONTEXT --------------------
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ------------------- SESSION --------------------
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.Cookie.SameSite = SameSiteMode.None; 
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// ------------------- SWAGGER --------------------
app.MapOpenApi();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/openapi/v1.json", "ShopStore API V1");
    c.RoutePrefix = "swagger";
});

// ------------------- PIPELINE --------------------
app.UseCors(builder => builder
    .WithOrigins("https://K1Saeid.github.io")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials() // مهم
);



app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthorization();

app.MapControllers();

app.Run();
