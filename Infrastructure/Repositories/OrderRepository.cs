using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext dbContext) : base(dbContext) {}

    public async override Task<PagedList<Order>> GetAllAsync(PaginationParams p, CancellationToken ct)
    {
        var query = DbSet.AsNoTracking().Include(o => o.Products);

        return await PagedList<Order>.CreateAsync(query, p.Page, p.PageSize, ct);
    }
    public async Task<PagedList<Order>> GetUserOrdersByUserIdAsync(string userId, PaginationParams p, CancellationToken ct)
    {
        var query = DbSet.AsNoTracking().Where(o => o.OrderedUserId == userId).Include(o => o.Products);

        return await PagedList<Order>.CreateAsync(query, p.Page, p.PageSize, ct);
    }
    public async Task<bool> IsOrderExistsByIdAsync(string orderId, CancellationToken ct)
    {
        return await DbSet.AnyAsync(x => x.Id == orderId, ct);
    }
}
