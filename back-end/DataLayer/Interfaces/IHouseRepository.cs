using Models;

namespace Interfaces
{
    public interface IHouseRepository : IRepository<House>
    {
        Task<House?> FindByTitleAsync(string houseTitle);
        Task<House?> FindHouseByIdAsync(Guid id);
        Task<List<House>?> ListAllHousesAsync();
    }
}