using Models;

namespace WebAPI.DTO.House;

public class HouseListDTO
{

    // Ska dessa vara nullable?
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime Added { get; set; }
    public int? Sold { get; set; }
    public string? Address { get; set; }
    public string? Region { get; set; }
    public string? Type { get; set; }
    public string? Size { get; set; }
    public string? Rooms { get; set; }
    public int Price { get; set; }
    public string? Currency { get; set; }
    public string? User { get; set; }

     public List<PictureModel>? Pictures {get;set;}
}