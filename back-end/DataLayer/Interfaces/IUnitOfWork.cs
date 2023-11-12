using Repository;

namespace Interfaces;

public interface IUnitOfWork
{
    HouseRepository HouseRepository { get; }
    NewsRepository NewsRepository { get; }
    UserRepository UserRepository { get; }

    Task<bool> Complete();
}
