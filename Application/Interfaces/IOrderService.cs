namespace Application.Interfaces;

public interface IOrderService
{
    Task<Result<string>> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct);
    Task<Result<PagedList<OrderDto>>> GetAllOrdersAsync(PaginationParams p, CancellationToken ct);
    Task<Result<PagedList<OrderDto>>> GetCurrentUserOrdersAsync(PaginationParams p, CancellationToken ct);
    Task<Result<string>> CancelOrderAsync(string orderId, CancellationToken ct);

}
