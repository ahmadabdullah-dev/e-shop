using Microsoft.AspNetCore.Http;

namespace Application.Dtos;

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public bool IsPersistence { get; set; }
}
public class RegisterDto
{
    public IFormFile? Image { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}
public class ResetPasswordDto
{
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required string NewPassword { get; set; }
}