using Microsoft.Extensions.Logging;

namespace Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IFileService _fileService;
    private readonly ILogger<ProductService> _logger;
    public ProductService(
        IProductRepository productRepository,
        IFileService fileService,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository;
        _fileService = fileService;
        _logger = logger;

    }

    public async Task<Result<string>> AddProductAsync(AddProductDto dto, CancellationToken ct)
    {
        string? imageUrl = null;
        string? imagePublicId = null;

        if (dto.Image is not null)
        {
            var imageResult = await _fileService.UploadImage(dto.Image);
        
            if (!imageResult.IsSuccess)
               return Result<string>.Failure(imageResult.Error!,400);
           
            imageUrl = imageResult.Value!.Url;
            imagePublicId = imageResult.Value.PublicId;
        }

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = imageUrl,
            ImagePublicId = imagePublicId,

        };
        try
        {
            await _productRepository.AddAsync(product, ct);
            await _productRepository.SaveChangesAsync(ct);

        }
        catch(Exception ex)
        {
            _logger.LogError(ex, $"Failed to save product {dto.Name}");
           
            if(imagePublicId is not null)
            {
                var cleanup = await _fileService.DeleteFile(imagePublicId);
                if (!cleanup.IsSuccess)
                    _logger.LogWarning($"Orphaned Cloudinary image {imagePublicId}");
            }

            throw;
        }
        return Result<string>.Success("Product added successfully");

    }
    public async Task<Result<PagedList<ProductDto>>> GetAllProductsAsync(PaginationParams p, CancellationToken ct)
    {
        var products = await _productRepository.GetAllAsync(p, ct);

        var dtos = new PagedList<ProductDto>
        {
            Items = products.Items.Select(x => new ProductDto 
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                ImageUrl = x.ImageUrl,
                IsActive = x.IsActive

            }).ToList(),

            CurrentPage = products.CurrentPage,
            TotalCount = products.TotalCount,
            TotalPages = products.TotalPages

        };
        return Result<PagedList<ProductDto>>.Success(dtos);
    }
    public async Task<Result<ProductDto>> GetProductByIdAsync(string id, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
       
        if (product is null)
            return Result<ProductDto>.Failure("Product not found", 404);
      
        var dto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            IsActive = product.IsActive
        };
        return Result<ProductDto>.Success(dto);
    }
    public async Task<Result<string>> UpdateProductAsync(UpdateProductDto dto, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(dto.Id, ct);
        
        if (product is null)
            return Result<string>.Failure("Product not found", 404);
       
        if (!string.IsNullOrEmpty(dto.Name))
            product.Name = dto.Name;
       
        if (!string.IsNullOrEmpty(dto.Description))
            product.Description = dto.Description;
       
        if (dto.Price.HasValue)
            product.Price = dto.Price.Value;
       
        product.IsActive = dto.IsActive;
       
        if (dto.Image is not null)
        {
            // Delete the old image if it exists
            if (!string.IsNullOrEmpty(product.ImagePublicId))
            {
                var deleteResult = await _fileService.DeleteFile(product.ImagePublicId);
                if (!deleteResult.IsSuccess)
                    _logger.LogWarning($"Failed to delete old image {product.ImagePublicId}");
            }

            // Upload the new image
            var uploadResult = await _fileService.UploadImage(dto.Image);
            if (!uploadResult.IsSuccess)
                return Result<string>.Failure(uploadResult.Error!, 400);
          
            product.ImageUrl = uploadResult.Value!.Url;
            product.ImagePublicId = uploadResult.Value.PublicId;
        }
        try
        {
            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to update product {dto.Id}");
            throw;
        }
        return Result<string>.Success("Product updated successfully");
    }
    public async Task<bool> IsProductExistsByIdAsync(string productId, CancellationToken ct)
    {
        return await _productRepository.IsProductExistsByIdAsync(productId, ct);
    }
    public async Task<Dictionary<string, decimal>> GetPricesByIdsAsync(List<string> ids, CancellationToken ct)
    {
       return await _productRepository.GetPricesByIdsAsync(ids, ct);
    }
    public async Task<Result<string>> DeleteProductAsync(string id, CancellationToken ct)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        
        if (product is null)
            return Result<string>.Failure("Product not found", 404);
       
        if (!string.IsNullOrEmpty(product.ImagePublicId))
        {
            var deleteResult = await _fileService.DeleteFile(product.ImagePublicId);
          
            if (!deleteResult.IsSuccess)
                _logger.LogWarning($"Failed to delete image {product.ImagePublicId}");
        }
        try
        {
            _productRepository.Remove(product);
            await _productRepository.SaveChangesAsync(ct);
        }
        catch(OperationCanceledException)
        {
            _logger.LogWarning($"Operation canceled while deleting product {id}");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to delete product {id}");
            throw;
        }
        return Result<string>.Success("Product deleted successfully");
    }
}
