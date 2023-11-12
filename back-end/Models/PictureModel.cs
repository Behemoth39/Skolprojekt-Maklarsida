using System.ComponentModel.DataAnnotations;

namespace Models;
public class PictureModel
{
    [Key]
    public Guid PictureId { get; set; } = Guid.NewGuid();

    public required string PictureUrl { get; set; }
}