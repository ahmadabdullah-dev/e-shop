using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAPI();
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseRateLimiter();

await app.Services.SeedDataAsync();

app.UseHttpsRedirection();

app.UseCors("AllowWeb");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
