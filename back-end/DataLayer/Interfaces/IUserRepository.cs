using Models;

namespace Interfaces
{
    public interface IUserRepository
    {
        Task<User?> FindByUserTokenAsync(int tokenUserId);
        Task<User?> FindByUsernameAsync(string Username);
    }
}