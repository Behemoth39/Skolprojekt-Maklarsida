namespace Models;

public class House
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required DateTime Added { get; set; }
    public int? Sold { get; set; }
    public required string Address { get; set; }
    public required string Region { get; set; }
    public required string Type { get; set; }
    public required string Size { get; set; }
    public required string Rooms { get; set; }
    public required int Price { get; set; }
    public required string Currency { get; set; }

    // Navigation properties
    // Vi vill kunna lägga till detta senare?
    public required User? Creator { get; set; }


    //One to Many ( Ett hus kan ha flera bilder)
    public List<PictureModel>? Pictures {get;set;}
}

