using System.ComponentModel.DataAnnotations;

namespace Models;




public class News{

    [Key]
    public Guid Id{get;set;}

    public required string Title { get; set; }
    public required string Content{get;set;}

    public DateTime Published {get;set;}


}

