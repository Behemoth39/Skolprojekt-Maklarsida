using Microsoft.EntityFrameworkCore;
using Data;
using Interfaces;
using Models;

namespace Repository
{
    public class NewsRepository : Repository<News>, INewsRepository
    {
        public NewsRepository(DatabaseContext context) : base(context) { }

        public async Task<News?> FindByTitleAsync(string newsTitle)
        {
            return await _context.News.SingleOrDefaultAsync(n => n.Title.Trim().ToLower() == newsTitle.Trim().ToLower());
        }
    }
}