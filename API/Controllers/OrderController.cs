using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
    
[Authorize]
[ConfirmedEmail]
public class OrderController : BaseApiController
{
    private readonly IOrderService _orderService;
    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto, CancellationToken ct)
    {
        var result = await _orderService.CreateOrderAsync(dto, ct);
        return HandleResult(result);
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentUserOrders([FromQuery] PaginationParams p, CancellationToken ct)
    {
        var result = await _orderService.GetCurrentUserOrdersAsync(p, ct);
        return HandleResult(result);
    }
}
