using Microsoft.AspNetCore.RateLimiting;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

namespace API;

public static class DependencyInjection
{
    public static IServiceCollection AddAPI(this IServiceCollection services)
    {
        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.Cookie.HttpOnly = true;
            options.ExpireTimeSpan = TimeSpan.FromDays(7);
            options.SlidingExpiration = true;
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowWeb",
                policy =>
                {
                    policy.WithOrigins("https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
        }); 
      
        //If anyone makes a request, everyone else gets blocked for 10 seconds.
        services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("authLimiter", opt =>
            {
                opt.Window = TimeSpan.FromSeconds(10);
                opt.PermitLimit = 3;
                opt.QueueLimit = 0;
            });

            options.RejectionStatusCode = 429;
        });

        // one limit per user (or per IP if not logged in). Each person gets their own 1 request per 30 seconds and doesn’t affect others.
        services.AddRateLimiter(options =>
        {
            options.AddPolicy("notificationLimiter", context =>
                RateLimitPartition.GetFixedWindowLimiter(context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        Window = TimeSpan.FromSeconds(30),
                        PermitLimit = 1,
                        QueueLimit = 0
                    }));

            options.RejectionStatusCode = 429;
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("requireAdminRole", policy =>
            {
                policy.RequireRole("Admin");
            });
        });

        services.AddControllers().AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        return services;
    }
}
