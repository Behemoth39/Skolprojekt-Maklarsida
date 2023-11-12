using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTO.User;

public class UserLoginDTO
{
    [MinLength(3, ErrorMessage = "Username must be at least 3 characters.")]
    public required string Username { get; set; }

    [MinLength(4, ErrorMessage = "Password must be at least 4 characters.")]
    public required string Password { get; set; }
}