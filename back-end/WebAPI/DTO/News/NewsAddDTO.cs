using System.ComponentModel.DataAnnotations;


namespace WebAPI.DTO.News;


public class NewsAddDTO
{

    [Required(ErrorMessage = "Title is required.")]
    public required string Title { get; set; }

    [Required(ErrorMessage = "You need to add content to create news.")]
    public required string Content{get;set;}

    public DateTime Published {get;set;}
}