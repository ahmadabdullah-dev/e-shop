using Microsoft.AspNetCore.Identity;

namespace Domain.Identity;

public class AppUser : IdentityUser
{
    public string? ImageUrl { get; set; }
    public string? ImagePublicId { get; set; }
    public string? FirstName { get; set; } 
    public string? LastName { get; set; } 
    public string? PendingEmail { get; set; } 
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
