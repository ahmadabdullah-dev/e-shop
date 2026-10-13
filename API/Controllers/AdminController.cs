namespace API.Controllers;
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }
}
