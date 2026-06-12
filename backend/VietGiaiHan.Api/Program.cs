using VietGiaiHan.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductCategoryRepository>();
builder.Services.AddScoped<ConsultationRequestRepository>();
builder.Services.AddScoped<AdminSummaryRepository>();

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactLocal", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("ReactLocal");
app.MapControllers();

app.Run();
