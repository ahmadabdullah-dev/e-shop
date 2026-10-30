namespace Application.Interfaces;

public interface IOrderService
{
    Task<Result<string>> CreateOrderAsync(CreateOrderDto dto, CancellationToken ct);
    Task<Result<PagedList<OrderDto>>> GetAllOrdersAsync(PaginationParams p, CancellationToken ct);
    Task<Result<PagedList<OrderDto>>> GetCurrentUserOrdersAsync(PaginationParams p, CancellationToken ct);
    Task<Result<string>> CancelOrderAsync(string orderId, CancellationToken ct);
    Task<Result<string>> ShipOrderAsync(string orderId, CancellationToken ct);
    Task<Result<string>> ProcessOrderAsync(string orderId, CancellationToken ct);
    Task<Result<string>> DeliverOrderAsync(string orderId, CancellationToken ct);
    Task<Result<OrderDto>> GetOrderDetailsAsync(string orderId, CancellationToken ct);
    Task<Result<string>> PendingOrderAsync(string orderId, CancellationToken ct);


}
