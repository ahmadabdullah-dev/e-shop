namespace Application.Interfaces;
public interface IProductService
{
    Task<Result<string>> AddProductAsync(AddProductDto dto, CancellationToken ct);
    Task<Result<PagedList<ProductDto>>> GetAllProductsAsync(PaginationParams p, CancellationToken ct);
    Task<Result<ProductDto>> GetProductByIdAsync(string id, CancellationToken ct);
    Task<Result<string>> UpdateProductAsync(UpdateProductDto dto, CancellationToken ct);
    Task<bool> IsProductExistsByIdAsync(string productId, CancellationToken ct);
    Task<Dictionary<string, decimal>> GetPricesByIdsAsync(List<string> ids, CancellationToken ct);
    Task<Result<string>> DeleteProductAsync(string id, CancellationToken ct);

}
