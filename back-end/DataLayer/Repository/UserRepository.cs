using Microsoft.EntityFrameworkCore;
using Data;
using Interfaces;
using Models;

namespace Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DatabaseContext context) : base(context) { }

        public async Task<User?> FindByUserTokenAsync(int tokenUserId)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Id == tokenUserId);
        }

         public async Task<User?> FindByUsernameAsync(string Username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == Username);

        }
    }
}