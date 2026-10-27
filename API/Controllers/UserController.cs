using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace API.Controllers;

[ConfirmedEmail]
[Authorize]
public class UserController : BaseApiController
{
    private readonly IUserService _userService;
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    [SkipConfirmedEmail]
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentUser(CancellationToken ct)
    {
        var result = await _userService.GetCurrentUserAsync(ct);
        return HandleResult(result);
    }
    [HttpPut("current")]
    public async Task<IActionResult> UpdateCurrentUser([FromForm] UpdateUserDto dto, CancellationToken ct)
    {
        var result = await _userService.UpdateCurrentUserAsync(dto, ct);
        return HandleResult(result);
    }
    [EnableRateLimiting("notificationLimiter")]
    [HttpPost("request-update-current-email")]
    public async Task<IActionResult> RequestUpdateCurrentEmail(RequestUpdateCurrentEmailDto dto)
    {
        var result = await _userService.RequestUpdateCurrentEmailAsync(dto);
        return HandleResult(result);
    }

    [HttpPatch("update-current-email")]
    public async Task<IActionResult> UpdateCurrentEmail(UpdateCurrentEmailDto dto)
    {
        var result = await _userService.UpdateCurrentEmailAsync(dto);
        return HandleResult(result);
    }
    [EnableRateLimiting("notificationLimiter")]
    [HttpPost("resend-update-current-email-confirmation-code")]
    public async Task<IActionResult> ResendUpdateCurrentEmailConfirmationCode()
    {
        var result = await _userService.ResendUpdateCurrentEmailConfirmationCodeAsync();
        return HandleResult(result);
    }
    [HttpPatch("update-current-username")]
    public async Task<IActionResult> UpdateCurrentUserName(UpdateCurrentUserNameDto dto)
    {
        var result = await _userService.UpdateCurrentUserNameAsync(dto);
        return HandleResult(result);
    }
    [HttpDelete("delete-current-user")]
    public async Task<IActionResult> DeleteCurrentUser()
    {
        var result = await _userService.DeleteCurrentUserAsync();
        return HandleResult(result);
    }
}
