using Interfaces;
using Repository;

namespace Data
{
    public class UnitOfWork: IUnitOfWork
    {
        private readonly DatabaseContext _context;
        public UnitOfWork(DatabaseContext context)
        {
            _context = context;
        }

        public HouseRepository HouseRepository => new HouseRepository(_context);
        public NewsRepository NewsRepository => new NewsRepository(_context);
        public UserRepository UserRepository => new UserRepository(_context);


        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
