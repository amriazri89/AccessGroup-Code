using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Data; // Make sure this is your DbContext namespace
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDBContext _context;
    private readonly IConfiguration _configuration; // for accessing JWT settings

    public AuthController(ApplicationDBContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("signup")]
    public IActionResult Signup([FromBody] User request)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "User already exists" });
        }

        _context.Users.Add(request);
        _context.SaveChanges();

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] User request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

        if (user == null || user.Password != request.Password)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);

        return Ok(new
        {
            message = "Login successful",
            userId = user.Id,
            token = token
        });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("id", user.Id.ToString()),
            new Claim("name", user.Name ?? "") // Use empty string if null
        };

        var jwtKey = _configuration["Jwt:Key"]
                     ?? throw new InvalidOperationException("JWT Key is not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
