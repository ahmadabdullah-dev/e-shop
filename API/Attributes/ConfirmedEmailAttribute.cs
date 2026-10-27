namespace API.Attributes;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class ConfirmedEmailAttribute : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        // If the action has [SkipConfirmedEmail], allow it without checking
        var skip = context.ActionDescriptor.EndpointMetadata.OfType<SkipConfirmedEmailAttribute>().Any();

        if (skip) return;

        // Attributes cant use constructor injection, so get the service here
        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();

        var user = await userService.GetCurrentUserAsync(context.HttpContext.RequestAborted);

        if (!user.IsSuccess)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        if (!user.Value!.IsEmailConfirmed)
            context.Result = new ForbidResult();
    }
}

// used if controller does not require confirmedEmail
public class SkipConfirmedEmailAttribute : Attribute { }