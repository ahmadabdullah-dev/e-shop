using Microsoft.AspNetCore.Http;

namespace Application.Dtos;

public class UserDto
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsEmailConfirmed { get; set; } 
    public string Role { get; set; } = null!;
    public string? ImageUrl { get; set; }

}
public class UpdateUserDto
{
    public IFormFile? Image { get; set; }
    public string? FirstName { get; set; } 
    public string? LastName { get; set; } 
}
public record RequestUpdateCurrentEmailDto(string NewEmail);
public record UpdateCurrentEmailDto(string Code);
public record UpdateCurrentUserNameDto(string NewUserName);
