using System.Text.Json;
using Bogus;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace WebAPI.Controllers;



[ApiController]
[Route("api/bogus")]
public class BogusController : ControllerBase
{

    /// <summary>
    /// Generates fake houses
    /// </summary>
    /// <param name="num">Number of houses to generate</param>
    /// <returns>Json string with fake houses</returns>
    [HttpGet("houses")]
    public IActionResult GenerateFakeHouses(int num)
    {
        return Content(GenerateHouseListings(10), "application/json; charset=utf-8");
    }

    /// <summary>
    /// Generate fake news
    /// </summary>
    /// <param name="num">Number of news to generate</param>
    /// <returns>Json string with fake news</returns>
    [HttpGet("news")]
    public IActionResult GenerateFakeNews(int num){
        return Content(GenerateNews(num), "application/json; charset=utf-8");
    }



    private static string GenerateHouseListings(int num)
    {


        var faker = new Faker("sv");
        List<House> houses = new List<House>();


        for (int i = 0; i <= num; i++)
        {
            houses.Add(new House
            {
                Id = Guid.NewGuid(),
                Title = faker.Lorem.Sentence(),
                Description = faker.Lorem.Paragraphs(),
                Added = faker.Date.Between(new DateTime(2022, 01, 01), new DateTime(2023, 10, 02)),
                Address = faker.Address.StreetAddress(),
                Region = faker.Address.City(),
                Type = HouseType(),
                Size = faker.Random.Int(10, 240).ToString(),
                Rooms = faker.Random.Int(1, 5).ToString(),
                Price = faker.Random.Int(1500000, 7500000),
                Currency = "SEK",
                Pictures = new List<PictureModel> {
                   new PictureModel {
                    PictureId = Guid.NewGuid(),
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?house"},
                   new PictureModel {
                    PictureId = Guid.NewGuid(),
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?livingroom"},
                   new PictureModel {
                     PictureId = Guid.NewGuid(),
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?bathroom"},
                   new PictureModel{
                    PictureId = Guid.NewGuid(),
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?backyard"}

                 },
                Creator = null,


            });
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false,
        };

        string jsonHouses = JsonSerializer.Serialize(houses, options);


        return jsonHouses;

    }

    private static string GenerateNews(int num){

        var faker = new Faker("sv");
        List<News> news = new List<News>();

        for(int i = 0; i <= num; i++){
            news.Add( new News{
                Id = Guid.NewGuid(),
                Title = faker.Lorem.Sentence(),
                Content = faker.Lorem.Paragraphs(),
                Published = faker.Date.Between(new DateTime(2022,01,01), new DateTime(2023,10,03))
            });
        }

          var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false,
        };

        string jsonNews = JsonSerializer.Serialize(news,options);

        return jsonNews;

    }


    private static string HouseType()
    {

        List<string> types = new List<string>{
            "Lägenhet",
            "Villa"
        };

        Random rand = new Random();

        return types[rand.Next(types.Count)];


    }




}



