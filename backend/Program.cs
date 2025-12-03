using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ------------------- DETECT ENVIRONMENT --------------------
bool isProduction = builder.Environment.IsProduction();

// ------------------- DATABASE --------------------
if (isProduction)
{
    // Railway → PostgreSQL
    builder.Services.AddDbContext<ShopContext>(options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    });
}
else
{
    // Local → SQL Server
    builder.Services.AddDbContext<ShopContext>(options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("ShopDb"));
    });
}

// ------------------- PORT FOR RAILWAY --------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// ------------------- DEPENDENCY INJECTION --------------------
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
        config => config
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

// ------------------- CONTROLLERS + JSON --------------------
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// ------------------- HTTP CONTEXT --------------------
builder.Services.AddHttpContextAccessor();

// ------------------- SESSION --------------------
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ------------------- OPENAPI / SWAGGER --------------------
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ------------------- SWAGGER --------------------
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
