using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext Db;
    protected readonly DbSet<T> DbSet;

    public Repository(ApplicationDbContext db)
    {
        Db = db;
        DbSet = db.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        return await DbSet.FindAsync(new object[] { id }, ct);
    }

    public virtual async Task<PagedList<T>> GetAllAsync(PaginationParams p, CancellationToken ct = default)
    {
        var query = DbSet.AsNoTracking();
        return await PagedList<T>.CreateAsync(query, p.Page, p.PageSize, ct);
    }

    public virtual async Task AddAsync(T entity, CancellationToken ct = default)
    {
        await DbSet.AddAsync(entity, ct);
    }

    public virtual void Update(T entity)
    {
        DbSet.Update(entity);
    }

    public virtual void Remove(T entity)
    {
        DbSet.Remove(entity);
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        return await Db.SaveChangesAsync(ct);
    }
}