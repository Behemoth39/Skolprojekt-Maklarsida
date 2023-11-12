using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using WebAPI.DTO.House;
using Models;
using Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/house")]
public class HouseController : ControllerBase
{

    private readonly IUnitOfWork _unitOfWork;
    private readonly IDistributedCache _distributedCache;
    private readonly string _houseChacheKey;

    public HouseController(IDistributedCache distributedCache, IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _distributedCache = distributedCache;
        _houseChacheKey = "HouseList";
    }



    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/house
    ///     {
    ///     "title": "Fint hus med sol läge!",
    ///     "description": "Vackert",
    ///     "added": "2023-01-01",
    ///     "address": "Gatan 1",
    ///     "region": "Skåne",
    ///     "type": "Villa",
    ///     "size": 120,
    ///     "Pictures": [
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?house"
    ///         },
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?livingroom"
    ///         },
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?backyard"
    ///         }
    ///     ],
    ///     "rooms": 4,
    ///     "price": 2000000,
    ///     "currency": "SEK"
    ///     }
    /// </remarks>

    /// <summary>
    /// Create house form [ADMIN]
    /// </summary>
    /// <response code="201">201 Created</response>
    /// <response code="400">400 Invalid data</response>
    [Authorize(Roles = "admin")]
    [HttpPost()]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddHouse(HouseAddDTO model)
    {
        if (!ModelState.IsValid) return BadRequest("Information saknas, kontrollera så att allt stämmer");

        var exists = await _unitOfWork.HouseRepository.FindByTitleAsync(model.Title);
        if (exists is not null) return BadRequest($"En hus med titel {model.Title} finns redan");

        int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);
        if (user is null) return NotFound($"Fel när användaren hätmades");

        var house = new House
        {
            Title = model.Title,
            Description = model.Description,
            Added = DateTime.Now,
            Address = model.Address,
            Region = model.Region,
            Type = model.Type ?? "Villa",
            Size = model.Size,
            Rooms = model.Rooms,
            Pictures = new List<PictureModel>
            {
                new() {
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?house"
                },
                new()
                {
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?livingroom"
                },
                new()
                {
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?backyard"
                },
                new(){
                    PictureUrl = "https://source.unsplash.com/random/900%C3%97700/?bedroom"
                }
            },


            Sold = model.Sold,
            Price = model.Price,
            Currency = model.Currency,
            Creator = user
        };

        await _unitOfWork.HouseRepository.AddAsync(house);

        if (await _unitOfWork.Complete())
        {
            await Extensions.DistributedCacheExtensions.RemoveRecordAsync(_distributedCache, _houseChacheKey);
            return StatusCode(201);
        }

        return StatusCode(500, "Internal Server Error");
    }



    /// <summary>
    /// List houses
    /// </summary>
    /// <response code="200">200 Ok</response>
    [HttpGet()]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<HouseListDTO>))]
    public async Task<ActionResult> ListHouses()
    {
        var cache = await Extensions.DistributedCacheExtensions.GetRecordAsync<List<HouseListDTO>>(_distributedCache, _houseChacheKey);
        if (cache is not null)
        {
            Console.WriteLine("Hämtar från cache");
            return Ok(cache);
        }
        else
        {
            Console.WriteLine("Hämtar från databas");
        }

        var houses = await _unitOfWork.HouseRepository.ListAllHousesAsync();
        var house = houses!
            .Select(h => new HouseListDTO
            {
                Id = h.Id,
                Title = h.Title,
                Description = h.Description,
                Added = h.Added,
                Sold = h.Sold,
                Address = h.Address,
                Region = h.Region,
                Type = h.Type,
                Size = h.Size,
                Rooms = h.Rooms,
                Price = h.Price,
                Currency = h.Currency,
                User = h.Creator!.Username,
                Pictures = h.Pictures!.ToList(),
            })
            .ToList();

        if (houses is null) return BadRequest($"Hittar inga hus");
        house = house.OrderByDescending(h => h.Added).ToList();

        await Extensions.DistributedCacheExtensions.SetRecordAsync(_distributedCache, _houseChacheKey, house);
        return Ok(house);
    }


    /// <summary>
    /// Get house by Id
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var houses = await _unitOfWork.HouseRepository.FindHouseByIdAsync(id);
            var house = new HouseListDTO
            {
                Id = houses!.Id,
                Title = houses.Title,
                Description = houses.Description,
                Added = houses.Added,
                Sold = houses.Sold,
                Address = houses.Address,
                Region = houses.Region,
                Type = houses.Type,
                Size = houses.Size,
                Rooms = houses.Rooms,
                Price = houses.Price,
                Currency = houses.Currency,
                User = houses.Creator!.Username,
                Pictures = houses.Pictures!.ToList()
            };

        if (houses is null) return BadRequest($"Hittar inte huset");
        return Ok(house);
    }



    /// <remarks>
    /// Sample request:
    ///
    ///     PUT /api/house/{id}
    ///     {
    ///     "title": "Fint hus med sol läge!",
    ///     "description": "Vackert",
    ///     "added": "2023-01-01",
    ///     "address": "Gatan 1",
    ///     "region": "Skåne",
    ///     "type": "Villa",
    ///     "size": 120,
    ///     "Pictures": [
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?house"
    ///         },
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?livingroom"
    ///         },
    ///         {
    ///             "PictureUrl": "https://source.unsplash.com/random/900%C3%97700/?backyard"
    ///         }
    ///     ],
    ///     "rooms": 4,
    ///     "price": 2000000,
    ///     "currency": "SEK"
    ///     }
    /// </remarks>

    /// <summary>
    /// Update house [ADMIN]
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateHouse(Guid id, HouseAddDTO model)
    {
        if (!ModelState.IsValid) return BadRequest("Information saknas, kontrollera så att allt stämmer");

        var house = await _unitOfWork.HouseRepository.FindByIdAsync(id);
        if (house is null)
        {
            return BadRequest($"Huset {model.Title} finns inte");
        }

        int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);


        if (user is null) return NotFound($"Fel när användaren hätmades");
        if (house.Creator?.Id != user.Id) return BadRequest($"Du kan inte ändra ett hus som inte är ditt");

        house.Title = model.Title;
        house.Description = model.Description;
        house.Sold = model.Sold;
        house.Address = model.Address;
        house.Region = model.Region;
        house.Type = model.Type;
        house.Size = model.Size;
        house.Rooms = model.Rooms;
        house.Price = model.Price;
        house.Currency = model.Currency;


        await _unitOfWork.HouseRepository.UpdateAsync(house);

        if (await _unitOfWork.Complete())
        {
            await Extensions.DistributedCacheExtensions.RemoveRecordAsync(_distributedCache, _houseChacheKey);
            return NoContent();
        }

        return StatusCode(500, "Internal Server Error");
    }



    /// <summary>
    /// Delete house [ADMIN]
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHouse(Guid id)
    {
        try
        {
            var house = await _unitOfWork.HouseRepository.FindByIdAsync(id);
            if (house is null) return BadRequest($"Hittar inte huset");

            int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);
            if (user is null) return NotFound($"Fel när användaren hätmades");
            if (house.Creator?.Id != user.Id) return BadRequest("Du kan inte ta bort ett hus som inte är ditt");

            await _unitOfWork.HouseRepository.DeleteAsync(house);
            if (await _unitOfWork.Complete())
            {
                await Extensions.DistributedCacheExtensions.RemoveRecordAsync(_distributedCache, _houseChacheKey);
                return NoContent();
            }
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal Server");
        }
        return StatusCode(500, "Internal Server");
    }
}