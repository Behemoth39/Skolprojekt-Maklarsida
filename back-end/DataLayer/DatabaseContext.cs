using Microsoft.EntityFrameworkCore;
using Models;

namespace Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<House> Houses { get; set; }
    public DbSet<News> News { get; set; }

    public DbSet<PictureModel> Pictures {get;set;}

    protected override void OnModelCreating(ModelBuilder builder){

        base.OnModelCreating(builder);
        builder.Entity<House>()
            .HasMany(h => h.Pictures)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);
    }
}