using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "requireAdminRole")]
[ConfirmedEmail]
public class AdminController : BaseApiController
{
    private readonly IAdminService _adminService;
    private readonly IOrderService _orderService;
    private readonly IProductService _productService;
    public AdminController(IAdminService adminService,
        IOrderService orderService,
        IProductService productService)
    {
        _adminService = adminService;
        _orderService = orderService;
        _productService = productService;
    }
    [HttpGet("all-orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] PaginationParams p, CancellationToken ct)
    {
        var result = await _orderService.GetAllOrdersAsync(p, ct);
        return HandleResult(result);
    }
    [HttpPost("add-product")]
    [RequestSizeLimit(6 * 1024 * 1024)] // 6mb
    public async Task<IActionResult> AddProduct([FromForm] AddProductDto dto, CancellationToken ct)
    {
        var result = await _productService.AddProductAsync(dto, ct);
        return HandleResult(result);
    }
    [HttpPut("update-product")]
    [RequestSizeLimit(6 * 1024 * 1024)] // 6mb  
    public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductDto dto, CancellationToken ct)
    {
        var result = await _productService.UpdateProductAsync(dto, ct);
        return HandleResult(result);
    }
}
