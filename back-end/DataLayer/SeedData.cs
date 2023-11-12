using System.Text.Json;
using Models;
using Microsoft.Extensions.Configuration;

namespace Data;

public class SeedData
{
    public static async Task Users(DatabaseContext dbContext, IConfiguration _configuration)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var JSONSeedDataLocation = _configuration["JSONSeedDataLocation"] ?? throw new Exception("JSONSeedDataLocation is not set in appsettings.json.");


        if (!dbContext.Users.Any())
        {
            Console.WriteLine("Seeding user...");
            var json = File.ReadAllText($"{JSONSeedDataLocation}/users.json");
            var jsonData = JsonSerializer.Deserialize<List<SeedUsersModel>>(json, options);

            if (jsonData is not null && jsonData.Count > 0)
            {
                string salt = _configuration["Salt"] ?? throw new Exception("Salt is not set in appsettings.json.");

                foreach (var j in jsonData)
                {
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(j.Password, salt);

                    var user = new User
                    {
                        Username = j.Username,
                        PasswordHash = hashedPassword,
                        Isadmin = j.Isadmin
                    };
                    dbContext.Users.Add(user);
                }
                await dbContext.SaveChangesAsync();
            }
        }
    }

    public static async Task Houses(DatabaseContext dbContext, IConfiguration _configuration)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };
        var JSONSeedDataLocation = _configuration["JSONSeedDataLocation"] ?? throw new Exception("JSONSeedDataLocation is not set in appsettings.json.");


        if (!dbContext.Houses.Any())
        {
            var json = File.ReadAllText($"{JSONSeedDataLocation}/houses.json");
            var houses = JsonSerializer.Deserialize<List<House>>(json, options) ?? throw new Exception("houses is null");

            houses.ForEach(house =>
            {
                var randomUser = dbContext.Users.Where(u => u.Isadmin == true).ToList().OrderBy(u => Guid.NewGuid()).First();
                house.Creator = randomUser;
            });

            await dbContext.AddRangeAsync(houses);
            await dbContext.SaveChangesAsync();
        }
    }


    public static async Task News(DatabaseContext dbContext, IConfiguration _configuration)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };
        var JSONSeedDataLocation = _configuration["JSONSeedDataLocation"] ?? throw new Exception("JSONSeedDataLocation is not set in appsettings.json.");


        if (!dbContext.News.Any())
        {
            var json = File.ReadAllText($"{JSONSeedDataLocation}/news.json");
            var news = JsonSerializer.Deserialize<List<News>>(json, options) ?? throw new Exception("news is null");

            await dbContext.AddRangeAsync(news);
            await dbContext.SaveChangesAsync();
        }

    }


    private class SeedUsersModel
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public bool Isadmin { get; set; } = false;
    }
}