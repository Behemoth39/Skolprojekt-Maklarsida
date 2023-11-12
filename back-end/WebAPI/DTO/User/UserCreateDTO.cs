using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTO.User;

public class UserCreateDTO
{
    [Required(ErrorMessage = "Username is required.")]
    [RegularExpression(@"^[^\s]+$", ErrorMessage = "Username cannot contain blank spaces.")]
    [MinLength(3, ErrorMessage = "Username must be at least 3 characters.")]
    [MaxLength(20, ErrorMessage = "Username cannot be longer than 20 characters.")]
    public required string Username { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [RegularExpression(@"^[^\s]+$", ErrorMessage = "Password cannot contain blank spaces.")]
    [MinLength(4, ErrorMessage = "Password must be at least 4 characters.")]
    [MaxLength(40, ErrorMessage = "Password cannot be longer than 40 characters.")]
    public required string Password { get; set; }

}