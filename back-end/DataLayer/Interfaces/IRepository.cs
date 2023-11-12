
namespace Interfaces
{
public interface IRepository<T> where T : class
{
    Task<IList<T>> ListAllAsync();
    Task<T?> FindByIdAsync(Guid id);
    Task<bool> AddAsync(T entity);
    Task<bool> UpdateAsync(T entity);
    Task<bool> DeleteAsync(T entity);
}
}
