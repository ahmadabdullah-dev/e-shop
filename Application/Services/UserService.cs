using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Application.Services;
public class UserService : IUserService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IEmailService _emailService;
    private readonly ILogger<UserService> _logger;
    private readonly IUserRepository _userRepository;
    private readonly SignInManager<AppUser> _signInManager;

    private readonly IFileService _fileService;
    public UserService(
        UserManager<AppUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        IEmailService emailService,
        ILogger<UserService> logger,
        SignInManager<AppUser> signInManager,
        IUserRepository userRepository,
        IFileService fileService    
    )
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _emailService = emailService;
        _logger = logger;
        _signInManager = signInManager;
        _userRepository = userRepository;
        _fileService = fileService;
    }
    public string? GetCurrentUserId()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
    public string? GetCurrentUserRole()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
    }
    public async Task<Result<UserDto>> GetCurrentUserAsync(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var role = GetCurrentUserRole();

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
            return Result<UserDto>.Failure("You must be logged in to perform this action.", 403);

        var user = await _userManager.FindByIdAsync(userId);


        if (user == null)
            return Result<UserDto>.Failure("User not found!. It may have been removed or deactivated.", 404);

        var dto = new UserDto
        {
            Id = userId,
            FirstName = user.FirstName!,
            LastName = user.LastName!,
            Email = user.Email!,
            IsEmailConfirmed = user.EmailConfirmed,
            Role = role,
            ImageUrl = user.ImageUrl
        };
        return Result<UserDto>.Success(dto);
    }
    public async Task<Result<string>> UpdateCurrentUserAsync(UpdateUserDto dto, CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        
        if (string.IsNullOrEmpty(userId))
            return Result<string>.Failure("You must be logged in to perform this action.", 403);
        
        var user = await _userManager.FindByIdAsync(userId);
       
        if (user == null)
            return Result<string>.Failure("User not found!. It may have been removed or deactivated.", 404);
            
        if(dto.FirstName !=  null)
            user.FirstName = dto.FirstName;
        
        if (dto.LastName != null)
            user.LastName = dto.LastName;
        if (dto.Image is not null)
        {
            // Delete the old image if it exists
            if (!string.IsNullOrEmpty(user.ImagePublicId))
            {
                var deleteResult = await _fileService.DeleteFile(user.ImagePublicId);
                if (!deleteResult.IsSuccess)
                    _logger.LogWarning($"Failed to delete old image {user.ImagePublicId}");
            }

            // Upload the new image
            var uploadResult = await _fileService.UploadImage(dto.Image);
            if (!uploadResult.IsSuccess)
                return Result<string>.Failure(uploadResult.Error!, 400);

            user.ImageUrl = uploadResult.Value!.Url;
            user.ImagePublicId = uploadResult.Value.PublicId;
        }
        var updateResult = await _userManager.UpdateAsync(user);
       
        if (!updateResult.Succeeded)
        {
            var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
            return Result<string>.Failure($"Failed to update user: {errors}", 400);
        }
        return Result<string>.Success("User updated successfully.");
    }
    public async Task<Result<string>> RequestUpdateCurrentEmailAsync(RequestUpdateCurrentEmailDto dto)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == null)
            return Result<string>.Failure("Unauthorized", 401);

        var currentUser = await _userManager.FindByIdAsync(currentUserId);

        if (currentUser == null)
            return Result<string>.Failure("Current user not found in db", 404);

        if (string.Equals(currentUser.Email, dto.NewEmail, StringComparison.OrdinalIgnoreCase))
            return Result<string>.Failure("You cannot change with the same email", 409);

        var existingUser = await _userManager.FindByEmailAsync(dto.NewEmail);

        if (existingUser != null)
            return Result<string>.Failure($"Email {dto.NewEmail} already taken", 400);

        currentUser.PendingEmail = dto.NewEmail;

        var updateResult = await _userManager.UpdateAsync(currentUser);
       
        if (!updateResult.Succeeded)
            return Result<string>.Failure(ServiceHelper.GetFirstError(updateResult), 400);
      
        try
        {
            await _emailService.SendCodeAsync(currentUser, "Email Update", EmailPurposes.EMAIL_UPDATE, dto.NewEmail);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while sending confirmation code to new email.");

            currentUser.PendingEmail = null;
           
            await _userManager.UpdateAsync(currentUser);
          
            return Result<string>.Failure("Failed to send confirmation code. Please try again later.", 400);
        }
        return Result<string>.Success("Confirmation code sent to new email");
    }
    public async Task<Result<string>> UpdateCurrentEmailAsync(UpdateCurrentEmailDto dto)
    {
        var currentUserId = GetCurrentUserId();
       
        if (currentUserId == null)
            return Result<string>.Failure("Unauthorized", 401);

        var currentUser = await _userManager.FindByIdAsync(currentUserId);
       
        if (currentUser == null)
            return Result<string>.Failure("Unauthorized", 401);

        if (string.IsNullOrWhiteSpace(currentUser.PendingEmail))
            return Result<string>.Failure("No pending email was found", 404);


        var isValid = await _userManager.VerifyUserTokenAsync(currentUser, TokenOptions.DefaultEmailProvider, EmailPurposes.EMAIL_UPDATE, dto.Code);

        if (!isValid)
            return Result<string>.Failure("Invalid or expired code.", 400);
       
        try
        {
                currentUser.Email = currentUser.PendingEmail;  
                currentUser.PendingEmail = null;

                await _userManager.UpdateAsync(currentUser);
        }
        catch (Exception ex)           
        {   
            _logger.LogError(ex, "Error occurred while updating email.");       
            return Result<string>.Failure("An error occurred while updating the email. Please try again later.", 400);
        }
       
        return Result<string>.Success("Email updated successfully");
    }
    public async Task<Result<string>> ResendUpdateCurrentEmailConfirmationCodeAsync()
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == null)
            return Result<string>.Failure("Unauthorized", 401);

        var currentUser = await _userManager.FindByIdAsync(currentUserId);

        if (currentUser == null)
            return Result<string>.Failure("User not found", 404);

        if (string.IsNullOrEmpty(currentUser.PendingEmail))
            return Result<string>.Failure("No pending email update request found. Please request an email update again.", 404);

        try
        {
            await _emailService.SendCodeAsync(currentUser, "Email Update", EmailPurposes.EMAIL_UPDATE, currentUser.PendingEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while resending confirmation code to new email.");
            return Result<string>.Failure("Failed to send confirmation code. Please try again later.", 400);
        }

        return Result<string>.Success("Confirmation code resent to new email");
    }
    public async Task<Result<string>> UpdateCurrentUserNameAsync(UpdateCurrentUserNameDto dto)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == null)
            return Result<string>.Failure("Unauthorized", 401);

        var currentUser = await _userManager.FindByIdAsync(currentUserId);

        if (currentUser == null)
            return Result<string>.Failure("User not found", 404);

        if (string.Equals(currentUser.UserName, dto.NewUserName, StringComparison.OrdinalIgnoreCase))
            return Result<string>.Failure("You cannot use the same UserName", 409);

        currentUser.UserName = dto.NewUserName;

        var updateResult = await _userManager.UpdateAsync(currentUser);

        if (!updateResult.Succeeded)
            return Result<string>.Failure(ServiceHelper.GetFirstError(updateResult), 400);

        return Result<string>.Success("UserName updated successfully");

    }
    public async Task<Result<string>> DeleteCurrentUserAsync()
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId == null)
            return Result<string>.Failure("Unauthorized", 401);

        var currentUser = await _userManager.FindByIdAsync(currentUserId);

        if (currentUser == null)
            return Result<string>.Failure("User not found", 404);

        var deleteResult = await _userManager.DeleteAsync(currentUser);

        if (deleteResult.Succeeded)
        {
            await _signInManager.SignOutAsync();
            return Result<string>.Success("User deleted successfully");

        }
        return Result<string>.Failure(ServiceHelper.GetFirstError(deleteResult), 400);

    }
}
