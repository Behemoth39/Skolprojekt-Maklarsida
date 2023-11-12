using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTO.News;
using Interfaces;
using Models;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;

    public NewsController(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Create news form  [ADMIN]
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpPost()]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> AddNews(NewsAddDTO model)
    {
        if (!ModelState.IsValid) return BadRequest("Information saknas, kontrollera s� att allt st�mmer");

        var exists = await _unitOfWork.NewsRepository.FindByTitleAsync(model.Title);
        if (exists is not null) return BadRequest($"En nyhet med titel {model.Title} finns redan");

        int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);
        if (user is null) return NotFound($"Fel när anvendaren hemtades");

        var news = new News
        {
            Title = model.Title,
            Content = model.Content,

        };

        await _unitOfWork.NewsRepository.UpdateAsync(news);

        if (await _unitOfWork.Complete())
        {
            return StatusCode(201);
        }

        return StatusCode(500, "Internal Server Error");
    }

    /// <summary>
    /// List news
    /// </summary>
    [HttpGet()]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<NewsListDTO>))]
    public async Task<ActionResult> ListNews()
    {
        var news = await _unitOfWork.NewsRepository.ListAllAsync();
        var newsList = news.Select(h => new NewsListDTO
            {
                Id = h.Id,
                Title = h.Title,
                Description = h.Content,
            }).ToList();

        if (news is null) return BadRequest($"Hittar inga news");
        return Ok(newsList);
    }

    /// <summary>
    /// Get news by Id
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var news = await _unitOfWork.NewsRepository.FindByIdAsync(id);
        var newsList = new NewsListDTO
        {
            Id = news!.Id,
            Title = news.Title,
            Description = news.Content,
        };

        if (news is null) return BadRequest($"Hittar inte Nyheter");
        return Ok(newsList);
    }

    /// <summary>
    /// Update a news item [ADMIN]
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateNews(Guid id, NewsAddDTO model)
    {
        if (!ModelState.IsValid) return BadRequest("Information saknas, kontrollera s� att allt st�mmer");

        var news = await _unitOfWork.NewsRepository.FindByIdAsync(id);
        if (news is null)
        {
            return BadRequest($"News {model.Title} finns inte");
        }

        int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);
        if (user is null) return NotFound($"Fel n�r anv�ndaren h�tmades");


        news.Title = model.Title;
        news.Content = model.Content;


        await _unitOfWork.NewsRepository.UpdateAsync(news);

        if (await _unitOfWork.Complete())
        {
            return NoContent();
        }

        return StatusCode(500, "Internal Server Error");
    }

    /// <summary>
    /// Delete a news item [ADMIN]
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNews(Guid id)
    {
        var news = await _unitOfWork.NewsRepository.FindByIdAsync(id);
        if (news is null) return BadRequest($"Hittar inte");

        int tokenUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _unitOfWork.UserRepository.FindByUserTokenAsync(tokenUserId);
        if (user is null) return NotFound($"Fel n�r anv�ndaren h�tmades");


        await _unitOfWork.NewsRepository.DeleteAsync(news);
        if (await _unitOfWork.Complete())
        {
            return NoContent();
        }

        return StatusCode(500, "Internal Server Error");
    }
}
