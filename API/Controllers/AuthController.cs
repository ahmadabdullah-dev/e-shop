using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    [EnableRateLimiting("authLimiter")]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        return HandleResult(result);
    }
    [EnableRateLimiting("authLimiter")]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        return HandleResult(result);
    }
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var result = await _authService.LogoutAsync();

        return HandleResult(result);
    }
    [Authorize]
    [HttpPatch("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string code)
    {
        var result = await _authService.ConfirmEmailAsync(code);

        return HandleResult(result);
    }
    [Authorize]
    [EnableRateLimiting("notificationLimiter")]
    [HttpPost("resend-email-confirmation-code")]
    public async Task<IActionResult> ResendEmailConfirmationCode()
    {
        var result = await _authService.ResendEmailConfirmationCodeAsync();
        return HandleResult(result);
    }
    [EnableRateLimiting("notificationLimiter")]
    [HttpPost("forget-password")]
    public async Task<IActionResult> ForgetPassword(string email)
    {
        var result = await _authService.ForgetPasswordAsync(email);
        return HandleResult(result);
    }
    [EnableRateLimiting("authLimiter")]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var result = await _authService.ResetPasswordAsync(dto);
        return HandleResult(result);
    }
}
