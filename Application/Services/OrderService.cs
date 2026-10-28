using Microsoft.Extensions.Logging;

namespace Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUserService _userService;
    private readonly IProductService _productService;
    private readonly ILogger<IOrderService> _logger;
    public OrderService(IOrderRepository orderRepository, 
        IUserService userService,
        IProductService productService,
        ILogger<IOrderService> logger)
    {
        _orderRepository = orderRepository;
        _userService = userService;
        _productService = productService;
        _logger = logger;
        
    }
    public async Task<Result<string>> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct)
    {
        var userId = _userService.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Result<string>.Failure("User is not authenticated.", 401);

        var ids = dto.Products.Select(p => p.ProductId).Distinct().ToList();

        foreach (var id in ids)
        {
            if (!await _productService.IsProductExistsByIdAsync(id, ct))
                return Result<string>.Failure($"Product with ID {id} not found.", 404);
        }

        var prices = await _productService.GetPricesByIdsAsync(ids, ct);

        var order = new Order
        {
            OrderedUserId = userId,
            OrderStatus = OrderStatuses.PENDING,
            ShippingAddress = dto.ShippingAddress,
            Products = dto.Products.Select(p => new ProductOrderItem
            {
                ProductId = p.ProductId,
                Quantity = p.Quantity,
                UnitPrice = prices[p.ProductId]
            }).ToList()
        };

        await _orderRepository.AddAsync(order, ct);
        await _orderRepository.SaveChangesAsync(ct);

        return Result<string>.Success(order.Id);
    }
    public async Task<Result<PagedList<OrderDto>>> GetAllOrdersAsync(PaginationParams p, CancellationToken ct)
    {
        var orders = await _orderRepository.GetAllAsync(p,ct);

        var dtos = new PagedList<OrderDto>
        {
            Items = orders.Items.Select(x => new OrderDto
            {
                Id = x.Id,
                UserId = x.OrderedUserId,
                ShippingAddress = x.ShippingAddress,
                Products = x.Products.Select(po => new ProductOrderItemDto
                {
                    ProductId = po.ProductId,
                    Quantity = po.Quantity,
                }).ToList(),
                TotalPrice = x.Products.Sum(po => po.Quantity * po.UnitPrice),
                OrderStatus = x.OrderStatus,
                CreatedAt = x.CreatedAt
            }).ToList(),
        };

        return Result<PagedList<OrderDto>>.Success(dtos);
    }
    public async Task<Result<PagedList<OrderDto>>> GetCurrentUserOrdersAsync(PaginationParams p, CancellationToken ct)
    {  
        var userId = _userService.GetCurrentUserId();
       
        if(string.IsNullOrEmpty(userId))
            return Result<PagedList<OrderDto>>.Failure("User is not authenticated.", 401);

        var orders = await _orderRepository.GetUserOrdersByUserIdAsync(userId, p, ct);

        var dtos = new PagedList<OrderDto>
        {
            Items = orders.Items.Select(x => new OrderDto
            {
                Id = x.Id,
                UserId = x.OrderedUserId,
                ShippingAddress = x.ShippingAddress,
                Products = x.Products.Select(po => new ProductOrderItemDto
                {
                    ProductId = po.ProductId,
                    Quantity = po.Quantity,
                }).ToList(),
                TotalPrice = x.Products.Sum(po => po.Quantity * po.UnitPrice),
                OrderStatus = x.OrderStatus,
                CreatedAt = x.CreatedAt
            }).ToList(),
        };

        return Result<PagedList<OrderDto>>.Success(dtos);
    }
    public async Task<Result<string>> CancelOrderAsync(string orderId, CancellationToken ct)
    {
        var currentUserId = _userService.GetCurrentUserId();
       
        if (string.IsNullOrEmpty(currentUserId))
            return Result<string>.Failure("User is not authenticated.", 401);

        var isAdmin = _userService.GetCurrentUserRole() == UserRoles.ADMIN;

        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId, ct);

            if (order is null || (order.OrderedUserId != currentUserId && !isAdmin))
                return Result<string>.Failure("Order not found.", 404);

            if (order.OrderStatus == OrderStatuses.CANCELLED)
                return Result<string>.Failure("Order is already cancelled.", 409);

            if (order.OrderStatus is OrderStatuses.SHIPPED or OrderStatuses.DELIVERED)
                return Result<string>.Failure("Order can no longer be cancelled.", 409);

            order.OrderStatus = OrderStatuses.CANCELLED;
            await _orderRepository.SaveChangesAsync(ct);

            return Result<string>.Success("Order cancelled successfully.");
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while cancelling order {OrderId} by user {UserId}", orderId, currentUserId);
            return Result<string>.Failure("An unexpected error occurred while cancelling the order.", 500);
        }
    }
}
