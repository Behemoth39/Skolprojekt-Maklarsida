using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebAPI.DTO.User;
using Interfaces;
using Models;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;

    public AuthController(IConfiguration configuration,IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
    }



    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/auth/register
    ///     {
    ///         "username": "user",
    ///         "password": "password"
    ///     }
    /// </remarks>

    /// <summary>
    /// Register form [ADMIN]
    /// </summary>
    /// <response code="201">201 Created</response>
    /// <response code="400">400 Invalid data</response>
    [Authorize(Roles = "admin")]
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(UserCreateDTO model)
    {

        string username = model.Username.Trim();

        // Check if the username is already taken
        if (await _unitOfWork.UserRepository.FindByUsernameAsync(username) != null)
        {
            return BadRequest("Username is already taken.");
        }

        // Hash the password with a salt
        string salt = _configuration["Salt"] ?? throw new Exception("Salt is not set in appsettings.json.");
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password, salt);

        var user = new User
        {
            Username = model.Username,
            PasswordHash = hashedPassword
        };

        await _unitOfWork.UserRepository.AddAsync(user);
        await _unitOfWork.Complete();

        return StatusCode(201);
    }



    /// <remarks>
    /// Sample request:
    ///
    ///     POST /api/auth/login
    ///     {
    ///         "username": "user",
    ///         "password": "password"
    ///     }
    /// </remarks>

    /// <summary>
    /// Login form
    /// </summary>
    /// <response code="200">200 Ok, returns token</response>
    /// <response code="401">401 Invalid email and/or password</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] UserLoginDTO model)
    {

        var user = await _unitOfWork.UserRepository.FindByUsernameAsync(model.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid username or password.");
        }

        var token = GenerateJwtToken(user.Id, user.Username, user.Isadmin);

        return Ok(new { Token = token });
    }



    /// <summary>
    /// List all users [AUTH]
    /// </summary>
    /// <response code="200">200 Ok</response>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _unitOfWork.UserRepository.ListAllAsync();
        var userList = users
            .Select(u => new UserListDTO
            {
                Id = u.Id,
                Username = u.Username
            })
            .ToList();

        return Ok(users);
    }



    /// <summary>
    /// Token generator
    /// </summary>
    private string GenerateJwtToken(int userId, string username, bool isadmin)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:JwtSecret"]!) ?? throw new Exception("JwtSecret is not set in appsettings.json.");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Name, username),
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                isadmin ? new(ClaimTypes.Role,"admin") : new(ClaimTypes.Role,"")
            }),
            Expires = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("JwtSettings:JwtExpirationDays")),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["JwtSettings:JwtIssuer"],
            Audience = _configuration["JwtSettings:JwtAudience"]
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

