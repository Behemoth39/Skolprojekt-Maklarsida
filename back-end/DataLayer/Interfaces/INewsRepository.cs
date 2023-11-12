using Models;

namespace Interfaces
{
    public interface INewsRepository : IRepository<News>
    {
        Task<News?> FindByTitleAsync(string newsTitle);
    }
}