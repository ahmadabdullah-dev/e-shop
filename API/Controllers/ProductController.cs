using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ConfirmedEmail]
public class ProductController : BaseApiController
{
    private readonly IProductService _productService;
    public ProductController(IProductService productService)
    {
        _productService = productService;
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("add")]
    [RequestSizeLimit(6 * 1024 * 1024)] // 6mb
    public async Task<IActionResult> AddProduct([FromForm] AddProductDto dto, CancellationToken ct)
    {
        var result = await _productService.AddProductAsync(dto, ct);
        return HandleResult(result);
    }
    [SkipConfirmedEmail]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllProducts([FromQuery] PaginationParams p, CancellationToken ct)
    {
        var result = await _productService.GetAllProductsAsync(p, ct);
        return HandleResult(result);
    }
    [SkipConfirmedEmail]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id, CancellationToken ct)
    {
        var result = await _productService.GetProductByIdAsync(id, ct);
        return HandleResult(result);
    }
    [HttpPut("update")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(6 * 1024 * 1024)] // 6mb  
    public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductDto dto, CancellationToken ct)
    {
        var result = await _productService.UpdateProductAsync(dto, ct);
        return HandleResult(result);
    }
}
