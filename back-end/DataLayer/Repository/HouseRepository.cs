using Microsoft.EntityFrameworkCore;
using Data;
using Interfaces;
using Models;

namespace Repository
{
    public class HouseRepository : Repository<House>, IHouseRepository
    {
        public HouseRepository(DatabaseContext context) : base(context) { }

        public async Task<House?> FindByTitleAsync(string houseTitle)
        {
            return await _context.Houses.SingleOrDefaultAsync(n => n.Title.Trim().ToLower() == houseTitle.Trim().ToLower());
        }

        public async Task<House?> FindHouseByIdAsync(Guid id)
        {
            return await _context.Houses.Include(h=>h.Creator).Include(h=>h.Pictures).FirstAsync(h=>h.Id == id);
        }

        public async Task<List<House>?> ListAllHousesAsync()
        {
            return await _context.Houses.Include(h => h.Creator).Include(h => h.Pictures).ToListAsync();
        }
    }
}