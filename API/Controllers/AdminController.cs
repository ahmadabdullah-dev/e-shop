using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "requireAdminRole")]
[ConfirmedEmail]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    private readonly IOrderService _orderService;
    public AdminController(IAdminService adminService,
        IOrderService orderService)
    {
        _adminService = adminService;
        _orderService = orderService;
    }
    [HttpGet("all-orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] PaginationParams p, CancellationToken ct)
    {
        var result = await _orderService.GetAllOrdersAsync(p, ct);
        return HandleResult(result);
    }
}
