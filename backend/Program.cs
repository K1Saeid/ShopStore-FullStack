using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using ShopStore.Models;
using ShopStore.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ------------------- CLOUDINARY CONFIGURATION --------------------
var config = builder.Configuration;

var cloudName =
    Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME")
    ?? config["Cloudinary:CloudName"];

var apiKey =
    Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY")
    ?? config["Cloudinary:ApiKey"];

var apiSecret =
    Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET")
    ?? config["Cloudinary:ApiSecret"];

Console.WriteLine("CloudName = " + cloudName);
Console.WriteLine("ApiKey = " + apiKey);

builder.Services.AddSingleton(new Cloudinary(new Account(
    cloudName,
    apiKey,
    apiSecret
)));

// ---- بقیه Program.cs همون که خودت نوشتی بمونه ----
