using System.ComponentModel.DataAnnotations;
using Models;

namespace WebAPI.DTO.House;

public class HouseAddDTO
{
    // Fixa alla ErrorMessage
    [Required(ErrorMessage = "Måste finnas")]
    public required string Title { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Description { get; set; }

    public int? Sold { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Address { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Region { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Type { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Size { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Rooms { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required int Price { get; set; }

    [Required(ErrorMessage = "Måste finnas")]
    public required string Currency { get; set; }

    public List<PictureModel>? Pictures {get;set;}
}