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
  
}
