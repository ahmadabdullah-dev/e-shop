namespace Infrastructure.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
   Task<PagedList<Order>> GetUserOrdersByUserIdAsync(string userId, PaginationParams p, CancellationToken ct);
   Task<bool> IsOrderExistsByIdAsync(string orderId, CancellationToken ct);

}
